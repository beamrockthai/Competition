import { db } from "../firebase"; // นำเข้า db จาก firebaseConfig.js
import { collection, getDocs } from "firebase/firestore";

const EvaluationAdmin = async () => {
  const submitFormCollection = collection(db, "submitform"); // ระบุ collection ที่ต้องการดึงข้อมูล
  const querySnapshot = await getDocs(submitFormCollection);

  // แปลงข้อมูลจาก Firestore ให้อยู่ในรูปแบบที่ตารางรองรับ
  const data = querySnapshot.docs.map((doc) => {
    const formData = doc.data();
    return {
      key: doc.id, // ใช้ document ID เป็น key
      directorName: formData.directorName || "ไม่ระบุ",
      formName: formData.formName || "ไม่ระบุ",
      submittedAt: new Date(formData.submittedAt).toLocaleString() || "ไม่ระบุ",
      evaluationResults: formData.evaluationResults || {},
      criteria: formData.criteria || [],
      score: formData.score !== undefined ? formData.score : null,
    };
  });

  return data;
};

const handleDelete = async (key) => {
  try {
    const docRef = doc(db, "submitform", key); // ระบุ document ที่จะลบ
    await deleteDoc(docRef); // ลบ document
    message.success("ลบฟอร์มสำเร็จ!");

    // อัปเดตตารางหลังจากลบสำเร็จ
    setData((prevData) => prevData.filter((item) => item.key !== key));
  } catch (error) {
    console.error("Error deleting form: ", error);
    message.error("เกิดข้อผิดพลาดในการลบฟอร์ม!");
  }
};

export default EvaluationAdmin;
export { handleDelete };
