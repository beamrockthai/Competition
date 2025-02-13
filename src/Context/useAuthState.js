import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase"; // ตรวจสอบว่าคุณ import db จากไฟล์ firebase config แล้ว
import { doc, getDoc } from "firebase/firestore";
import { getUserRole } from "./authHelpers";

export function useAuthState() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          console.log("Current user from Auth:", currentUser);

          // ดึงเอกสารผู้ใช้จาก Firestore ที่ collection "users" โดยใช้ currentUser.uid
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          let firebaseUserData = {};
          if (userDocSnap.exists()) {
            firebaseUserData = userDocSnap.data();
            console.log("Firestore user data:", firebaseUserData);
          } else {
            console.warn("ไม่พบเอกสาร Firestore สำหรับ user:", currentUser.uid);
          }

          // ตรวจสอบและรวม firstName กับ lastName หากมี
          const fullName =
            firebaseUserData.firstName && firebaseUserData.lastName
              ? `${firebaseUserData.firstName} ${firebaseUserData.lastName}`
              : currentUser.displayName || "ผู้ใช้งาน";

          const userData = {
            id: currentUser.uid,
            name: fullName,
            email: currentUser.email,
          };

          console.log("Final userData ที่จะ set:", userData);
          setUser(userData);
          await getUserRole(currentUser.uid, setRole);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return { user, role, setRole };
}
