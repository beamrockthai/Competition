import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { message } from "antd";

// 📌 ฟังก์ชันสมัครการแข่งขัน
export const registerTournament = async (
  tournamentId,
  userId,
  teamType,
  teamMembers = [],
  teamName // เพิ่ม teamName
) => {
  try {
    if (!tournamentId || !userId || !teamType) {
      message.error("ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบการสมัคร");
      console.log("❌ Missing Data:", { tournamentId, userId, teamType });
      return;
    }

    console.log("🟢 Registering Data:", {
      tournamentId,
      userId,
      teamType,
      teamMembers,
      teamName, //เพิ่มมา
    });

    const registrationRef = collection(
      db,
      `tournaments/${tournamentId}/registrations`
    );
    const newRegistration = {
      userId,
      tournamentId, // บันทึก tournamentId
      teamType,
      teamMembers,
      teamName, // บันทึก teamName
      registeredAt: Timestamp.now(),
    };

    await addDoc(registrationRef, newRegistration);
    message.success("สมัครแข่งขันสำเร็จ!");
  } catch (error) {
    console.error("❌ Error registering for tournament:", error);
    message.error("เกิดข้อผิดพลาดในการสมัคร กรุณาลองใหม่อีกครั้ง");
  }
};
