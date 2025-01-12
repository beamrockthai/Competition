// Context/UserAuth.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // สมัครผู้ใช้ด้วยอีเมล/รหัสผ่าน
  async function signUp(email, password) {
    // สร้าง user ใน Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const newUser = userCredential.user;

    // -- ถ้าต้องการบันทึกข้อมูลเพิ่มใน Firestore --
    const userDocRef = doc(db, "users", newUser.uid);
    await setDoc(userDocRef, {
      email: newUser.email,
      role: role, // เก็บ role ลง firestore
      createdAt: serverTimestamp(),
      // อาจเก็บข้อมูลอื่น ๆ เช่น displayName, role ฯลฯ
    });

    return newUser;
  }

  // ล็อกอินด้วยอีเมล/รหัสผ่าน
  async function logIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const existingUser = userCredential.user;

    // -- หากต้องการตรวจสอบข้อมูลใน Firestore --
    const userDocRef = doc(db, "users", existingUser.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      setRole(docSnap.data().role);
      // ถ้าไม่พบใน Firestore (แต่ Auth มี) อาจเลือก setDoc หรือแจ้งเตือนก็ได้
      console.log("No user doc in Firestore, create if needed");
      // await setDoc(userDocRef, { email: existingUser.email });
    } else {
      console.log("User doc found:", docSnap.data());
    }

    return existingUser;
  }

  // ออกจากระบบ
  function logOut() {
    return signOut(auth);
  }

  // ติดตามสถานะผู้ใช้ (login / logout) แบบเรียลไทม์
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider value={{ user, role, logIn, signUp, logOut }}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
