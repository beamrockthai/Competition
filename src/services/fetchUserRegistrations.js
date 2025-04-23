import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

// 📌 ดึงรายการการแข่งขันที่ User สมัครไว้
export const fetchUserRegistrations = async (userId) => {
  try {
    if (!userId) {
      console.error("❌ Error: userId is undefined");
      return [];
    }

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
          teamType: doc.data().teamType || "individual",
          teamName: doc.data().teamName || "",
          teamMembers: doc.data().teamMembers || [],
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

// admin
export const fetchAllRegistrations = async () => {
  try {
    const tournamentsRef = collection(db, "tournaments");
    const tournamentsSnapshot = await getDocs(tournamentsRef);
    const tournaments = tournamentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const allRegistrations = [];
    for (const tournament of tournaments) {
      const regRef = collection(
        db,
        `tournaments/${tournament.id}/registrations`
      );
      const regSnapshot = await getDocs(regRef);

      regSnapshot.forEach((docSnap) => {
        const regData = docSnap.data();
        allRegistrations.push({
          registrationId: docSnap.id,
          tournamentId: tournament.id,
          tournamentName: tournament.tournamentName || "ไม่มีชื่อ",
          userId: regData.userId,
          teamName: regData.teamName || "",
          teamType: regData.teamType || "individual",
          teamMembers: regData.teamMembers || [],
          ...regData,
        });
      });
    }

    return allRegistrations;
  } catch (error) {
    console.error(" Error fetching all registrations:", error);
    return [];
  }
};

//ยกเลิกการสมัคร users
export const deleteUserRegistration = async (tournamentId, registrationId) => {
  try {
    const regDocRef = doc(
      db,
      `tournaments/${tournamentId}/registrations/${registrationId}`
    );
    await deleteDoc(regDocRef);
    console.log(" ลบการสมัครสำเร็จ:", registrationId);
    return true;
  } catch (error) {
    console.error("ลบการสมัครไม่สำเร็จ:", error);
    return false;
  }
};
