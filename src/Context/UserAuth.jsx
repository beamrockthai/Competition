import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "./useAuthState";
import { signUpUser, signUpDirector, logIn, logOut } from "./authFuntions";
import { auth } from "../firebase"; // Firebase Authentication

const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const { user, role, setRole } = useAuthState();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid || currentUser.id); // ✅ ใช้ currentUser.id ถ้าไม่มี uid
      } else {
        setUserId(null);
      }
      console.log(
        "🟢 Auth State Changed - userId:",
        currentUser?.uid || currentUser?.id
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserAuthContext.Provider
      value={{
        user,
        userId, // ✅ ส่ง userId ให้ใช้งาน
        role,
        logIn: (email, password) => logIn(email, password, setRole),
        signUpUser,
        signUpDirector,
        logOut: () => {
          logOut(setRole);
          setUserId(null); // ✅ รีเซ็ต userId เมื่อออกจากระบบ
        },
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
