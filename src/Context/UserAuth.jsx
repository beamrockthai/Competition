import React, { createContext, useContext } from "react";
import { useAuthState } from "./useAuthState";
import { signUpUser, signUpDirector, logIn, logOut } from "./authFuntions";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const { user, role, setRole } = useAuthState();

  return (
    <userAuthContext.Provider
      value={{
        user,
        role,
        logIn: (email, password) => logIn(email, password, setRole),
        signUpUser,
        signUpDirector,
        logOut: () => logOut(setRole),
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
