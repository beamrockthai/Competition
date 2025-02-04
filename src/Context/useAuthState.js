import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getUserRole } from "./authHelpers";

export function useAuthState() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // เพิ่มฟิลด์ name โดยอิงจาก displayName หรือ email
        const userData = {
          id: currentUser.uid,
          name: currentUser.displayName || currentUser.email, // ใช้ displayName ถ้ามี
          email: currentUser.email,
        };
        setUser(userData);

        // ดึง role จาก getUserRole
        await getUserRole(currentUser.uid, setRole);
      } else {
        setUser(null);
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return { user, role, setRole };
}
