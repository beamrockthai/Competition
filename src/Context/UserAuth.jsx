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

  // ✅ ฟังก์ชันสมัครสมาชิกทั่วไป
  async function signUpUser(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;

      const userDocRef = doc(db, "users", newUser.uid);
      await setDoc(userDocRef, {
        email: newUser.email,
        role: "user", // 🔹 ให้ default เป็น "user"
        createdAt: serverTimestamp(),
      });

      return newUser;
    } catch (error) {
      console.error("Error signing up user:", error);
      throw error;
    }
  }

  // ✅ ฟังก์ชันสมัครกรรมการ โดยไม่ทำให้ Admin ถูกล็อกเอาต์
  async function signUpDirector(email, password) {
    try {
      const adminEmail = auth.currentUser?.email; // 🔹 บันทึกอีเมลของ Admin
      const adminPassword = prompt("Enter Admin Password to stay logged in"); // 🔹 ขอรหัสผ่านของ Admin

      if (!adminPassword) {
        throw new Error("Admin password is required.");
      }

      // 🔹 สร้างบัญชีกรรมการใน Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;

      // 🔹 บันทึกข้อมูลกรรมการใน Firestore
      const userDocRef = doc(db, "users", newUser.uid);
      await setDoc(userDocRef, {
        email: newUser.email,
        role: "director",
        createdAt: serverTimestamp(),
      });

      // ✅ ล็อกอินกลับเป็น Admin หลังจากสร้างกรรมการ
      if (adminEmail) {
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      }

      return newUser.uid;
    } catch (error) {
      console.error("Error creating director:", error);
      throw error;
    }
  }

  async function logIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const existingUser = userCredential.user;

    const userDocRef = doc(db, "users", existingUser.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      setRole(docSnap.data().role);
    }

    return existingUser;
  }

  function logOut() {
    setRole(null);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{ user, role, logIn, signUpUser, signUpDirector, logOut }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
