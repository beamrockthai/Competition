import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { message } from "antd";

// ดึงข้อมูลทัวร์นาเมนต์ทั้งหมดจาก Firestore
export const fetchTournaments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "tournaments"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error("Error loading data: ", err);
    message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    return [];
  }
};

// เพิ่มทัวร์นาเมนต์ใหม่ลง Firestore
export const addTournament = async (form) => {
  try {
    const { tournamentName, description, startDate, endDate, maxRounds } = form;
    if (
      !tournamentName ||
      !description ||
      !startDate ||
      !endDate ||
      !maxRounds
    ) {
      message.warning("กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }

    const startTimestamp = Timestamp.fromDate(new Date(startDate));
    const endTimestamp = Timestamp.fromDate(new Date(endDate));

    await addDoc(collection(db, "tournaments"), {
      tournamentName,
      description,
      startDate: startTimestamp,
      endDate: endTimestamp,
      maxRounds: parseInt(maxRounds, 10),
    });

    message.success("เพิ่มข้อมูลเรียบร้อยแล้ว");
    return true;
  } catch (err) {
    console.error("Error adding document: ", err);
    message.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
    return false;
  }
};

// ลบทัวร์นาเมนต์จาก Firestore
export const deleteTournament = async (id) => {
  try {
    const docRef = doc(db, "tournaments", id);
    await deleteDoc(docRef);
    message.success("ลบข้อมูลเรียบร้อยแล้ว");
  } catch (err) {
    console.error("Error deleting document: ", err);
    message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
  }
};

// อัปเดตข้อมูลทัวร์นาเมนต์ใน Firestore
export const updateTournament = async (id, values) => {
  try {
    const { tournamentName, description, startDate, endDate, maxRounds } =
      values;

    const startTimestamp = Timestamp.fromDate(startDate.toDate());
    const endTimestamp = Timestamp.fromDate(endDate.toDate());

    const docRef = doc(db, "tournaments", id);
    await updateDoc(docRef, {
      tournamentName,
      description,
      startDate: startTimestamp,
      endDate: endTimestamp,
      maxRounds: parseInt(maxRounds, 10),
    });

    message.success("แก้ไขข้อมูลเรียบร้อยแล้ว");
    return true;
  } catch (err) {
    console.error("Error updating document: ", err);
    message.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    return false;
  }
};
