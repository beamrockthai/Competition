import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { message } from "antd";

// ✅ โหลดกรรมการจาก Firestore
export const loadDirectors = async (setDirectors) => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const directorsList = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => user.role === "director");

    console.log("Loaded Directors:", directorsList);
    setDirectors(directorsList);
  } catch (error) {
    console.error("Error loading directors:", error);
    message.error("Failed to load directors.");
  }
};

// ✅ สมัครกรรมการใหม่
export const addDirector = async (
  values,
  signUpDirector,
  setPasswords,
  setDirectors,
  form
) => {
  try {
    const newDirectorUID = await signUpDirector(values.email, values.password);

    // 🔹 เพิ่มข้อมูลกรรมการลงใน Firestore
    const directorRef = doc(db, "users", newDirectorUID);
    await setDoc(directorRef, {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      idCard: values.idCard,
      address: values.address,
      role: "director",
      createdAt: new Date(),
    });

    setPasswords((prev) => ({ ...prev, [values.email]: values.password }));
    message.success("Director created successfully!");

    await loadDirectors(setDirectors); // ✅ โหลดข้อมูลใหม่
    form.resetFields();
  } catch (error) {
    message.error("Failed to create director: " + error.message);
  }
};

// ✅ ฟังก์ชันลบกรรมการ
export const deleteDirector = async (id, setDirectors) => {
  try {
    await deleteDoc(doc(db, "users", id));
    message.success("Director deleted successfully!");
    await loadDirectors(setDirectors); // ✅ โหลดข้อมูลใหม่
  } catch (error) {
    console.error("Error deleting director:", error);
    message.error("Failed to delete director: " + error.message);
  }
};
