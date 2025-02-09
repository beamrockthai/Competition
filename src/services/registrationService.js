import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { message } from "antd";

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
