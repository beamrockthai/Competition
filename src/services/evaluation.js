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
  const formDoc = doc(db, "evaluations", id); // แก้ไขจาก "forms" เป็น "evaluations"
  await updateDoc(formDoc, form);
};

/// Delete a form
export const deleteForm = async (id) => {
  const formDoc = doc(db, "evaluations", id); // แก้ไขจาก "forms" เป็น "evaluations"
  await deleteDoc(formDoc);
};
