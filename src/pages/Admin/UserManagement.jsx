import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Card,
  Row,
  Col,
  Typography,
  message,
  Popconfirm,
} from "antd";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const { Title } = Typography;

export const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.role === "user"); // 🔹 แสดงเฉพาะ User ที่ไม่ใช่ Admin หรือ Director

      setUsers(usersList);
    } catch (error) {
      console.error("Error loading users:", error);
      message.error("Failed to load users.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id)); // ลบ User ออกจาก Firestore
      message.success("User deleted successfully!");
      loadUsers(); // โหลดข้อมูลใหม่หลังจากลบ
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        User Management
      </Title>

      {/* ✅ Responsive Card Layout */}
      <Row gutter={[16, 16]} justify="center">
        {users.map((user) => (
          <Col xs={24} sm={12} md={8} lg={6} key={user.id}>
            <Card
              title={user.email}
              bordered={false}
              style={{ textAlign: "center" }}
            >
              <Popconfirm
                title="Are you sure to delete this user?"
                onConfirm={() => handleDeleteUser(user.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete User</Button>
              </Popconfirm>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
