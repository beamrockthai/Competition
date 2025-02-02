import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const formsCollection = collection(db, "evaluations");

// Fetch all forms or filter by assignedTo
export const fetchDirecForm = async (userId = null) => {
  const snapshot = await getDocs(formsCollection);
  const forms = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // หากมี userId ให้กรองฟอร์มที่มี assignedTo ตรงกับ userId
  if (userId) {
    return forms.filter((form) => form.assignedTo?.includes(userId));
  }

  // ถ้าไม่มี userId ให้คืนค่าฟอร์มทั้งหมด
  return forms;
};
