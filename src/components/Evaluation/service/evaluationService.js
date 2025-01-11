// service/evaluationService.js
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

// ดึงข้อมูลใบประเมินทั้งหมดจาก Firestore
export const fetchEvaluation = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "evaluation"));
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

// เพิ่มใบประเมินใหม่ลง Firestore
export const addEvaluation = async (form) => {
  try {
    const {
      playerName,
      playerID,
      round,
      score,
      comments,
      startDate,
      endDate,
      judgeNameId,
    } = form;
    if (
      !playerName ||
      !playerID ||
      !round ||
      !score ||
      !comments ||
      !startDate ||
      !endDate ||
      !judgeNameId
    ) {
      message.warning("กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }

    const startTimestamp = Timestamp.fromDate(new Date(startDate));
    const endTimestamp = Timestamp.fromDate(new Date(endDate));

    await addDoc(collection(db, "evaluation"), {
      playerName,
      playerID: parseInt(playerID, 10),
      round: parseInt(round, 10),
      score: parseInt(score, 10),
      comments,
      startDate: startTimestamp,
      endDate: endTimestamp,
      judgeNameId: parseInt(judgeNameId, 10),
    });

    message.success("เพิ่มข้อมูลเรียบร้อยแล้ว");
    return true;
  } catch (err) {
    console.error("Error adding document: ", err);
    message.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
    return false;
  }
};

// ลบใบประเมินจาก Firestore
export const deleteEvaluation = async (id) => {
  try {
    const docRef = doc(db, "evaluation", id);
    await deleteDoc(docRef);
    message.success("ลบข้อมูลเรียบร้อยแล้ว");
  } catch (err) {
    console.error("Error deleting document: ", err);
    message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
  }
};

// อัปเดตข้อมูลใบประเมินใน Firestore
export const updateEvaluation = async (id, values) => {
  try {
    const {
      playerName,
      playerID,
      round,
      score,
      comments,
      startDate,
      endDate,
      judgeNameId,
    } = values;

    const startTimestamp =
      startDate instanceof moment
        ? Timestamp.fromDate(startDate.toDate())
        : Timestamp.fromDate(new Date(startDate));
    const endTimestamp =
      endDate instanceof moment
        ? Timestamp.fromDate(endDate.toDate())
        : Timestamp.fromDate(new Date(endDate));

    const docRef = doc(db, "evaluation", id);
    await updateDoc(docRef, {
      playerName,
      playerID: parseInt(playerID, 10),
      round: parseInt(round, 10),
      score: parseInt(score, 10),
      comments,
      startDate: startTimestamp,
      endDate: endTimestamp,
      judgeNameId: parseInt(judgeNameId, 10),
    });

    message.success("แก้ไขข้อมูลเรียบร้อยแล้ว");
    return true;
  } catch (err) {
    console.error("Error updating document: ", err);
    message.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    return false;
  }
};
