import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Typography } from "antd";
import { useUserAuth } from "../../Context/UserAuth";

const { Title } = Typography;

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const { user, signUpUser } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    console.log("Registering user with values:", values);
    try {
      const newUser = await signUpUser(
        values.email,
        values.password,
        values.firstName,
        values.lastName,
        values.address,
        values.phone
      );
      console.log("✅ User successfully created:", newUser);
      message.success("Register successful!");
      navigate("/");
    } catch (error) {
      console.log("Register error:", error.code, error.message);
      message.error("Register failed! " + error.message);
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
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: "Please enter your first name!" }]}
        >
          <Input placeholder="firstName" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: "Please enter your last name!" }]}
        >
          <Input placeholder="lastName" />
        </Form.Item>

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

        {/* ✅ เพิ่มช่องกรอก Phone Number */}
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter your phone number!" },
          ]}
        >
          <Input placeholder="Phone Number" />
        </Form.Item>

        {/* ✅ เพิ่มช่องกรอก Address */}
        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please enter your address!" }]}
        >
          <Input.TextArea placeholder="Address" />
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
