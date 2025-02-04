import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Firebase configuration

// อ้างอิงถึงคอลเลกชัน evaluations ใน Firestore
const formsCollection = collection(db, "evaluations");

// ฟังก์ชันดึงข้อมูลแบบฟอร์ม (Filter by userId ถ้ามี)
export const fetchDirecForm = async (userId = null) => {
  try {
    const snapshot = await getDocs(formsCollection);
    const forms = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // หากมี userId ให้กรองฟอร์มที่มี assignedTo ตรงกับ userId
    if (userId) {
      return forms.filter((form) => form.assignedTo?.includes(userId));
    }

    // ถ้าไม่มี userId ให้คืนค่าฟอร์มทั้งหมด
    return forms;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw error;
  }
};

// ฟังก์ชันบันทึกผลการประเมินไปยัง Firestore
export const submitEvaluationToFirestore = async ({
  formId,
  formName,
  directorName,
  evaluationResults,
}) => {
  try {
    const docRef = doc(collection(db, "submitform"), formId); // อ้างอิงถึง submitform
    await setDoc(docRef, {
      formId, // ไอดีของแบบฟอร์ม
      formName, // ชื่อแบบฟอร์ม
      directorName, // ชื่อผู้ประเมิน
      evaluationResults, // ผลการประเมิน
      submittedAt: new Date().toISOString(), // เวลาที่บันทึก
    });
    console.log("Evaluation successfully submitted to Firestore!");
  } catch (error) {
    console.error("Error submitting evaluation:", error);
    throw error;
  }
};

// ฟังก์ชันดึงข้อมูลผลการประเมินจาก Firestore
export const fetchEvaluations = async () => {
  try {
    const evaluationsCollection = collection(db, "submitform"); // ชี้ไปที่คอลเลกชัน submitform
    const snapshot = await getDocs(evaluationsCollection);
    const evaluations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return evaluations; // คืนค่าผลการประเมินทั้งหมดในรูปแบบ array
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    throw error; // โยนข้อผิดพลาดขึ้นไป
  }
};
