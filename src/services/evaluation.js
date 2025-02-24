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

const formsCollection = collection(db, "evaluations");

// Fetch all forms
export const fetchForms = async () => {
  const snapshot = await getDocs(formsCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getFormsById = async (formId) => {
  if (!formId) {
    console.error("Form ID is required");
    return null;
  }

  try {
    const formRef = doc(db, "evaluations", formId); // ✅ เปลี่ยนเป็นดึงข้อมูลจาก ID เดียว
    const formSnap = await getDoc(formRef);

    if (!formSnap.exists()) {
      console.error(`Form with ID ${formId} not found`);
      return null;
    }

    return {
      id: formSnap.id,
      ...formSnap.data(),
    };
  } catch (error) {
    console.error("Error fetching form by ID:", error);
    return null;
  }
};

// Add a new form
export const addForm = async (form) => {
  await addDoc(formsCollection, form);
};

// Update an existing form
export const updateForm = async (id, form) => {
  const formDoc = doc(db, "evaluations", id);
  await updateDoc(formDoc, form);
};

// Delete a form
export const deleteForm = async (id) => {
  const formDoc = doc(db, "evaluations", id);
  await deleteDoc(formDoc);
};

// สำหรับดึงข้อมูลกรรมการมาใช้งานจาก firestore
export const fetchDirectors = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((user) => user.role === "director");
};

// เลือกฟอร์มให้กรรมการ
export const assignForm = async (formId, directorIds) => {
  try {
    const formDoc = doc(db, "evaluations", formId);
    await updateDoc(formDoc, { assignedTo: directorIds });
    console.log("Form assigned successfully");
  } catch (error) {
    console.error("Error assigning form:", error);
  }
};

// Fetch forms assigned to a specific director
export const fetchDirecForm = async (userId) => {
  const snapshot = await getDocs(formsCollection);
  const forms = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return forms.filter((form) => form.assignedTo?.includes(userId));
};

// ดึงข้อมูลการแข่งขันจาก Firestore
export const fetchTournaments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "tournaments"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return [];
  }
};

// ดึงข้อมูลผู้เข้าแข่งขันจาก Firestore (users ที่มี role: "user")
export const fetchUsers = async () => {
  try {
    const q = query(collection(db, "users"), where("role", "==", "user"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched Users:", users); // ✅ ตรวจสอบว่าข้อมูลถูกดึงมาหรือไม่

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getUsersById = async (userid) => {
  console.log("userid", userid);

  const userRef = doc(db, "users", userid); // ใช้ doc() แทน query()
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = { id: userSnap.id, ...userSnap.data() };
    console.log("ByFetched User:", userData);
    return userData;
  } else {
    console.log("No user found");
    return {};
  }
};
