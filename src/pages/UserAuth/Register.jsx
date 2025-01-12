import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Typography } from "antd";
import { useUserAuth } from "../../Context/UserAuth";

const { Title } = Typography;

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const { user, signUpUser } = useUserAuth(); // ✅ ใช้ signUpUser แทน
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await signUpUser(values.email, values.password);
      message.success("Register successful!");
      navigate("/");
    } catch (error) {
      console.log("Register error:", error.code, error.message);
      switch (error.code) {
        case "auth/email-already-in-use":
          message.error("This email is already in use!");
          break;
        case "auth/invalid-email":
          message.error("Invalid email format!");
          break;
        default:
          message.error("Register failed! " + error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto",
        padding: "1rem",
        background: "#f0f2f5",
        borderRadius: "8px",
      }}
    >
      <Title level={3} style={{ textAlign: "center", color: "#1890ff" }}>
        Register
      </Title>
      <Form
        name="register"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input your Email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your Password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
