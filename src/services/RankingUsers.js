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
export async function createScore(userId, tournamentId, score, round) {
  // ดึงข้อมูล user ก่อน
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

  // ถ้าผ่านการตรวจสอบ role แล้ว → เพิ่มคะแนน
  return await addDoc(collection(db, "scores"), {
    userId,
    tournamentId,
    score,
    round,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
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
