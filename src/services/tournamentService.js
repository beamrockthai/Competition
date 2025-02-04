import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
  getCountFromServer,
  getDoc,
} from "firebase/firestore";
import { message } from "antd";
import moment from "moment";

// 📌 ดึงข้อมูลทัวร์นาเมนต์ทั้งหมดจาก Firestore
export const fetchTournaments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "tournaments"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      status: doc.data().status || false, // กำหนดค่าเริ่มต้นเป็น false ถ้าไม่มีค่า
    }));
  } catch (err) {
    console.error("Error loading data: ", err);
    message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    return [];
  }
};

// 📌 เพิ่มทัวร์นาเมนต์ใหม่ลง Firestore
export const addTournament = async (form) => {
  try {
    const {
      tournamentName,
      description,
      startDate,
      endDate,
      maxRounds,
      status,
    } = form;

    if (
      !tournamentName ||
      !description ||
      !startDate ||
      !endDate ||
      !maxRounds ||
      status === undefined // ✅ แก้ไขจาก `!status` เป็น `status === undefined`
    ) {
      message.warning("กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }

    const startTimestamp = Timestamp.fromDate(moment(startDate).toDate());
    const endTimestamp = Timestamp.fromDate(moment(endDate).toDate());

    await addDoc(collection(db, "tournaments"), {
      tournamentName,
      description,
      startDate: startTimestamp,
      endDate: endTimestamp,
      maxRounds: parseInt(maxRounds, 10),
      status: status ?? false, // ✅ ถ้า `status` ไม่มีค่า ให้ใช้ค่าเริ่มต้น `false`
    });

    message.success("เพิ่มข้อมูลเรียบร้อยแล้ว");
    return true;
  } catch (err) {
    console.error("Error adding document: ", err);
    message.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
    return false;
  }
};

// 📌 ลบทัวร์นาเมนต์จาก Firestore
export const deleteTournament = async (id) => {
  try {
    await deleteDoc(doc(db, "tournaments", id));
    message.success("ลบข้อมูลเรียบร้อยแล้ว");
  } catch (err) {
    console.error("Error deleting document: ", err);
    message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
  }
};

// 📌 อัปเดตข้อมูลทัวร์นาเมนต์ใน Firestore
export const updateTournament = async (id, values) => {
  try {
    const {
      tournamentName,
      description,
      startDate,
      endDate,
      maxRounds,
      status,
    } = values;

    if (
      !tournamentName ||
      !description ||
      !startDate ||
      !endDate ||
      !maxRounds ||
      status === undefined // ✅ แก้ไขจาก `!status` เป็น `status === undefined`
    ) {
      message.warning("กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }

    const startTimestamp = Timestamp.fromDate(moment(startDate).toDate());
    const endTimestamp = Timestamp.fromDate(moment(endDate).toDate());

    await updateDoc(doc(db, "tournaments", id), {
      tournamentName,
      description,
      startDate: startTimestamp,
      endDate: endTimestamp,
      maxRounds: parseInt(maxRounds, 10),
      status: status ?? false, // ✅ ถ้า `status` ไม่มีค่า ให้ใช้ค่าเริ่มต้น `false`
    });

    message.success("แก้ไขข้อมูลเรียบร้อยแล้ว");
    return true;
  } catch (err) {
    console.error("Error updating document: ", err);
    message.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    return false;
  }
};

// 📌 ดึงจำนวนผู้สมัครของแต่ละทัวร์นาเมนต์
export const getTournamentRegistrations = async (tournamentId) => {
  try {
    const snapshot = await getCountFromServer(
      collection(db, `tournaments/${tournamentId}/registrations`)
    );
    return snapshot.data().count; // ดึงจำนวนผู้สมัคร
  } catch (err) {
    console.error("Error fetching registrations count:", err);
    return 0;
  }
};

// 📌 ดึงรายละเอียดทัวร์นาเมนต์ตาม ID
export const getTournamentById = async (tournamentId) => {
  try {
    const docRef = doc(db, "tournaments", tournamentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error fetching tournament details:", err);
    return null;
  }
};
