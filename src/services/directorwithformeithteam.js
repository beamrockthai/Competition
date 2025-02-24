import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { getFormsById } from "./evaluation";

const formsCollection = collection(db, "directorwithformwithteam");
const formsCollection2 = collection(db, "evaluations");

export const assignFormToDirectorwithTournament = async (form) => {
  await addDoc(formsCollection, form);
};

// export const fetchDirectorForm = async (userId = null) => {
//   try {
//     const formData = getDocs(formsCollection2);
//     const snapshot = await getDocs(formsCollection);
//     const forms = snapshot.docs.map((doc) => ({
//       id: doc.id,

//       ...doc.data(),
//     }));
// const finalForms =
//     // หากมี userId ให้กรองฟอร์มที่มี assignedTo ตรงกับ userId
//     if (userId) {
//       return forms.filter((form) => form.directorId?.includes(userId));

//     }

//     // ถ้าไม่มี userId ให้คืนค่าฟอร์มทั้งหมด
//     return forms;
//   } catch (error) {
//     console.error("Error fetching forms:", error);
//     throw error;
//   }
// };
export const fetchDirectorForm = async (userId = null) => {
  if (!userId) {
    console.error("User ID is required");
    return [];
  }

  console.log("Fetching forms for user:", userId);

  try {
    // ✅ แก้ path ของ Collection ให้ถูกต้อง
    const directorFormsCollection = collection(db, "directorwithformwithteam");

    // ✅ ใช้ array-contains เพื่อค้นหา userId ใน directorId (array)
    const q = query(
      directorFormsCollection,
      where("directorId", "array-contains", userId)
    );

    const querySnapshot = await getDocs(q);

    // ✅ ดึงข้อมูลจาก Firestore
    const forms = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Forms:", forms);

    // ✅ ดึงข้อมูลของแต่ละฟอร์ม
    const formsPromises = forms.map((e) => getFormsById(e.evaformId));
    const formsDataArray = await Promise.all(formsPromises);

    // ✅ รวมข้อมูลของแบบฟอร์ม
    const formsFinal = forms.map((form, index) => ({
      ...form,
      ...formsDataArray[index],
    }));

    console.log("formsFinal", formsFinal);
    return formsFinal;
  } catch (error) {
    console.error("Error fetching director forms:", error);
    return [];
  }
};
