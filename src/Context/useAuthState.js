import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getUserRole } from "./authHelpers";

export function useAuthState() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await getUserRole(currentUser.uid, setRole);
      }
    });
    return () => unsubscribe();
  }, []);

  return { user, role, setRole };
}
