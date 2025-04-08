import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

// สมัครสมาชิกทั่วไป
export async function signUpUser(
  email,
  password,
  firstName,
  lastName,
  address,
  phone
) {
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
      firstName,
      lastName,
      address,
      phone,
      role: "user",
      createdAt: serverTimestamp(),
    });
    console.log("email:", email);

    return newUser;
  } catch (error) {
    console.error("Error signing up user:", error);
    throw error;
  }
}

// สมัครกรรมการโดยไม่ทำให้ Admin ถูกล็อกเอาต์
export async function signUpDirector(email, password) {
  try {
    const adminEmail = auth.currentUser?.email;
    const adminPassword = prompt("Enter Admin Password to stay logged in");

    if (!adminPassword) {
      throw new Error("Admin password is required.");
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const newUser = userCredential.user;

    const userDocRef = doc(db, "users", newUser.uid);
    await setDoc(userDocRef, {
      email: newUser.email,
      role: "director",
      createdAt: serverTimestamp(),
    });

    // ล็อกอินกลับเป็น Admin
    if (adminEmail) {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    }

    return newUser.uid;
  } catch (error) {
    console.error("Error creating director:", error);
    throw error;
  }
}

// ฟังก์ชันล็อกอิน
export async function logIn(email, password, setRole) {
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

// ฟังก์ชันล็อกเอาต์
export function logOut(setRole) {
  setRole(null);
  return signOut(auth);
}
