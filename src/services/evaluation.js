import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
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
