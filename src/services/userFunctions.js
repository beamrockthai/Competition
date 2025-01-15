import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { message } from "antd";

// ✅ โหลด Users จาก Firestore
export const loadUsers = async (setUsers, setLoading) => {
  setLoading(true);
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersList = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((user) => user.role === "user"); // ✅ กรองเฉพาะผู้ใช้ทั่วไป

    console.log("Loaded Users:", usersList);
    setUsers(usersList);
  } catch (error) {
    console.error("Error loading users:", error);
    message.error("Failed to load users.");
  } finally {
    setLoading(false);
  }
};

// ✅ ฟังก์ชันลบ Users
export const deleteUser = async (id, setUsers, setLoading) => {
  try {
    setLoading(true);
    await deleteDoc(doc(db, "users", id)); // 🔹 ลบ User จาก Firestore
    message.success("User deleted successfully!");
    await loadUsers(setUsers, setLoading); // ✅ โหลดข้อมูลใหม่หลังลบ
  } catch (error) {
    console.error("Error deleting user:", error);
    message.error("Failed to delete user: " + error.message);
  }
};
