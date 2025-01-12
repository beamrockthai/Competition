import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  message,
  Popconfirm,
  Row,
  Col,
  Card,
} from "antd";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useUserAuth } from "../../Context/UserAuth";
import { db } from "../../firebase";

export const ManageDirectors = () => {
  const { signUpDirector } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [directors, setDirectors] = useState([]);
  const [passwords, setPasswords] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    loadDirectors();
  }, []);

  // ✅ โหลดกรรมการจาก Firestore
  const loadDirectors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const directorsList = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.role === "director");

      setDirectors(directorsList);
    } catch (error) {
      console.error("Error loading directors:", error);
      message.error("Failed to load directors.");
    }
  };

  // ✅ สมัครกรรมการใหม่
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const newDirectorUID = await signUpDirector(
        values.email,
        values.password
      );

      setPasswords((prev) => ({ ...prev, [values.email]: values.password }));

      message.success("Director created successfully!");
      loadDirectors();
      form.resetFields();
    } catch (error) {
      message.error("Failed to create director: " + error.message);
    }
    setLoading(false);
  };

  // ✅ ฟังก์ชันลบกรรมการ
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      message.success("Director deleted successfully!");
      loadDirectors();
    } catch (error) {
      console.error("Error deleting director:", error);
      message.error("Failed to delete director: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Manage Directors
      </h2>

      {/* ✅ Responsive Form */}
      <Row justify="center">
        <Col xs={24} sm={18} md={14} lg={10}>
          <Card>
            <Form layout="vertical" onFinish={onFinish} form={form}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter a valid email!",
                  },
                ]}
              >
                <Input placeholder="Enter Director Email" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter a password!" },
                ]}
              >
                <Input.Password placeholder="Enter Password" />
              </Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                สร้างกรรมการ
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* ✅ Responsive Table */}
      <Table
        dataSource={directors}
        columns={[
          {
            title: "Email",
            dataIndex: "email",
            responsive: ["xs", "sm", "md", "lg"],
          },
          { title: "Role", dataIndex: "role", responsive: ["sm", "md", "lg"] },
          {
            title: "Password",
            dataIndex: "email",
            render: (email) => passwords[email] || "N/A",
            responsive: ["md", "lg"],
          },
          {
            title: "Actions",
            dataIndex: "id",
            render: (id) => (
              <Popconfirm
                title="Are you sure to delete this director?"
                onConfirm={() => handleDelete(id)}
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            ),
          },
        ]}
        rowKey="id"
        style={{ marginTop: "20px" }}
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }} // ✅ ป้องกัน Table ล้นหน้าจอ
      />
    </div>
  );
};
