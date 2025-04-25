import {
  collection,
  addDoc,
  query,
  where,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

// เพิ่มคะแนน (เฉพาะ role "user")
export async function getTournamentParticipants(tournamentId) {
  const q = query(
    collection(db, "scores"),
    where("tournamentId", "==", tournamentId)
  );
  const querySnapshot = await getDocs(q);

  const participants = [];

  for (const docSnap of querySnapshot.docs) {
    const scoreData = docSnap.data();
    const userRef = doc(db, "users", scoreData.userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      participants.push({
        userId: scoreData.userId,
        displayName: userData.displayName || "ไม่ระบุชื่อ",
        teamName: userData.teamName || "ไม่ระบุทีม",
        score: scoreData.score,
        round: scoreData.round,
      });
    }
  }

  return participants;
}

export async function updateScore(scoreId, newScore) {
  return await updateDoc(doc(db, "scores", scoreId), {
    score: newScore,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteScore(scoreId) {
  return await deleteDoc(doc(db, "scores", scoreId));
}

export async function GetAllScore() {
  const snapshot = await getDocs(collection(db, "scores"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getUserScores(userId) {
  const q = query(collection(db, "scores"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  const scores = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const totalScore = scores.reduce((sum, item) => sum + item.score, 0);

  return {
    scores,
    totalScore,
  };
}

export async function createScore(userId, tournamentId, score, round) {
  const userDocRef = doc(db, "users", userId);
  const userSnap = await getDoc(userDocRef);

  if (!userSnap.exists()) {
    throw new Error("ไม่พบผู้ใช้");
  }

  const userData = userSnap.data();

  if (userData.role !== "user") {
    throw new Error(
      "เฉพาะผู้ใช้ทั่วไป (role: user) เท่านั้นที่สามารถเพิ่มคะแนนได้"
    );
  }

  return await addDoc(collection(db, "scores"), {
    userId,
    tournamentId,
    score,
    round,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
