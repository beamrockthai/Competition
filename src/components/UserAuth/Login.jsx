// components/UserAuth/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useUserAuth } from "../../Context/UserAuth";

const { Title } = Typography;

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const { user, logIn } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // ถ้าผู้ใช้ล็อกอินค้างอยู่แล้ว ให้เด้งกลับไปหน้า "/" เลย
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await logIn(values.email, values.password);
      message.success("Login successful!");
      navigate("/"); // ไปหน้า home (หรือ dashboard) ได้เลย
    } catch (error) {
      // แสดงรายละเอียด error ชัดเจน
      console.log("Login error:", error.code, error.message);
      switch (error.code) {
        case "auth/wrong-password":
          message.error("Wrong password! Please try again.");
          break;
        case "auth/user-not-found":
          message.error("User not found. Please register first.");
          break;
        case "auth/too-many-requests":
          message.error("Too many failed attempts. Please try again later.");
          break;
        default:
          message.error("Login failed! " + error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: 350, padding: "20px", borderRadius: "10px" }}>
        <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
          Login
        </Title>
        <Form name="login_form" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Typography.Text>
            Don't have an account? <a href="/register">Register</a>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
};
