import { db } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
  getDoc,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { message } from "antd";
import { getUsersById } from "./evaluation";

// 📌 ฟังก์ชันสมัครการแข่งขัน

export const registerTournament = async (
  tournamentId,
  userId,
  teamType,
  teamMembers = [],
  teamName
) => {
  try {
    // ✅ เพิ่ม log เช็คข้อมูลที่ได้รับก่อนทำงาน
    console.log("🟢 Received Data in registerTournament:", {
      tournamentId,
      userId,
      teamType,
      teamMembers,
      teamName,
    });

    if (!tournamentId || !userId || !teamType) {
      message.error("ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบการสมัคร");
      console.error("❌ Missing Data:", { tournamentId, userId, teamType });
      return;
    }

    const registrationRef = collection(
      db,
      `tournaments/${tournamentId}/registrations`
    );
    const newRegistration = {
      userId,
      tournamentId,
      teamType,
      teamMembers,
      teamName,
      registeredAt: Timestamp.now(),
    };

    await addDoc(registrationRef, newRegistration);
    // message.success("สมัครแข่งขันสำเร็จ!");
  } catch (error) {
    console.error("❌ Error registering for tournament:", error);
    message.error("เกิดข้อผิดพลาดในการสมัคร กรุณาลองใหม่อีกครั้ง");
  }
};
export const getUserByTournament = async (tournamentId) => {
  try {
    // 🔹 ดึงข้อมูลการลงทะเบียน
    const registrationsRef = collection(
      db,
      `tournaments/${tournamentId}/registrations`
    );
    const q = query(
      registrationsRef,
      where("tournamentId", "==", tournamentId)
    );
    const querySnapshot = await getDocs(q);

    // 🔹 แปลงข้อมูลการลงทะเบียนเป็น array
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Users:", users);

    // 🔹 ดึงข้อมูลของผู้ใช้แต่ละคน
    const userPromises = users.map((user) => getUsersById(user.userId));
    const userDataArray = await Promise.all(userPromises);

    // 🔹 รวมข้อมูล user กับ registration
    const userFinal = users.map((user, index) => ({
      ...user,
      userFirstName: userDataArray[index]?.firstName || "ไม่พบชื่อ",
      userLastName: userDataArray[index]?.lastName || "ไม่พบชื่อสกุล",
    }));

    console.log("userFinal", userFinal);
    return userFinal; // ✅ ส่งข้อมูลที่รวมกันแล้วกลับไป
  } catch (error) {
    console.error("Error fetching users by tournament:", error);
    return [];
  }
};
