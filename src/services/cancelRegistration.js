import { db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";

// 📌 ยกเลิกการสมัครแข่งขัน
export const cancelRegistration = async (registrationId, tournamentId) => {
  try {
    await deleteDoc(
      doc(db, `tournaments/${tournamentId}/registrations`, registrationId)
    );
  } catch (error) {
    console.error("Error cancelling registration:", error);
    throw error;
  }
};
