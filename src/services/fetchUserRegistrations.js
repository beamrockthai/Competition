import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// 📌 ดึงรายการการแข่งขันที่ User สมัครไว้
export const fetchUserRegistrations = async (userId) => {
  try {
    console.log("🟢 Fetching Registrations for User:", userId);

    const tournamentsRef = collection(db, "tournaments");
    const tournamentsSnapshot = await getDocs(tournamentsRef);
    const tournaments = tournamentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const registrations = [];
    for (const tournament of tournaments) {
      const regQuery = query(
        collection(db, `tournaments/${tournament.id}/registrations`),
        where("userId", "==", userId)
      );
      const regSnapshot = await getDocs(regQuery);
      regSnapshot.forEach((doc) => {
        registrations.push({
          id: doc.id,
          tournamentId: tournament.id,
          tournamentName: tournament.tournamentName || "ไม่มีชื่อ",
          ...doc.data(),
        });
      });
    }

    console.log("🟢 User Registrations:", registrations);
    return registrations;
  } catch (error) {
    console.error("❌ Error fetching user registrations:", error);
    return [];
  }
};
