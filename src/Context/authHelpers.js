import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// ฟังก์ชันดึงข้อมูลผู้ใช้จาก Firestore
export async function getUserRole(uid, setRole) {
  try {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      setRole(docSnap.data().role);
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
  }
}
