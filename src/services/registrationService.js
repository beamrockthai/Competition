// ฟังก์ชันบันทึกการสมัครแข่งขัน
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export const registerTournament = async (
  tournamentId,
  userId,
  teamType,
  teamMembers
) => {
  const registrationRef = collection(
    db,
    `tournaments/${tournamentId}/registrations`
  );
  await addDoc(registrationRef, { userId, teamType, teamMembers });
};
