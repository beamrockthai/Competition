import { useState, useEffect } from "react";
import { message } from "antd";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // ตรวจสอบ path ให้ถูกต้อง
import { useUserAuth } from "../Context/UserAuth";

export const useProfileSettings = () => {
  const { user } = useUserAuth(); // ดึง user จาก Context
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  // โหลดข้อมูลผู้ใช้จาก Firestore เมื่อ component mount
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, "users", user.id);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setInitialValues(userDocSnap.data()); // เซ็ตค่าข้อมูลเริ่มต้น
          } else {
            message.warning("ไม่พบข้อมูลผู้ใช้ในระบบ");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          message.error("ไม่สามารถดึงข้อมูลส่วนตัวได้");
        }
      };
      fetchUserData();
    }
  }, [user]);

  // ฟังก์ชันอัปเดตข้อมูลผู้ใช้
  const updateProfile = async (values) => {
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", user.id);
      await updateDoc(userDocRef, values); // อัปเดตข้อมูลทั้งหมดตาม values
      message.success("อัปเดตข้อมูลส่วนตัวสำเร็จ!");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("อัปเดตข้อมูลส่วนตัวไม่สำเร็จ");
    }
    setLoading(false);
  };

  return { initialValues, loading, updateProfile };
};
