import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Typography, Modal } from "antd";
import { useUserAuth } from "../../Context/UserAuth";

const { Title } = Typography;

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ เพิ่ม state สำหรับ Modal
  const [formValues, setFormValues] = useState(null); // ✅ เก็บค่าฟอร์มก่อนส่ง
  const { user, signUpUser } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // ✅ เปิด Popup ยืนยันก่อนสมัคร
  const showConfirmModal = (values) => {
    setFormValues(values); // เก็บค่ากรอกฟอร์มไว้ใช้ตอนสมัคร
    setIsModalOpen(true);
  };

  // ✅ ดำเนินการสมัครเมื่อกด "ยืนยัน"
  const handleConfirmRegister = async () => {
    setLoading(true);
    setIsModalOpen(false); // ปิด popup

    try {
      console.log("Registering user with values:", formValues);
      const newUser = await signUpUser(
        formValues.email,
        formValues.password,
        formValues.firstName,
        formValues.lastName,
        formValues.address,
        formValues.phone
      );
      console.log("✅ User successfully created:", newUser);
      message.success("สมัครสมาชิกสำเร็จ!");
      navigate("/");
    } catch (error) {
      console.log("Register error:", error.code, error.message);
      message.error("สมัครสมาชิกไม่สำเร็จ: " + error.message);
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
        สมัครสมาชิก
      </Title>

      <Form
        name="register"
        initialValues={{ remember: true }}
        onFinish={showConfirmModal} // ✅ เรียก popup แทนการสมัครทันที
        layout="vertical"
      >
        <Form.Item
          name="firstName"
          label="ชื่อ"
          rules={[{ required: true, message: "กรุณากรอกชื่อ!" }]}
        >
          <Input placeholder="ชื่อ" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="นามสกุล"
          rules={[{ required: true, message: "กรุณากรอกนามสกุล!" }]}
        >
          <Input placeholder="นามสกุล" />
        </Form.Item>

        <Form.Item
          name="email"
          label="อีเมล"
          rules={[
            { required: true, message: "กรุณากรอกอีเมล!" },
            { type: "email", message: "กรุณากรอกอีเมลให้ถูกต้อง!" },
          ]}
        >
          <Input placeholder="อีเมล" />
        </Form.Item>

        <Form.Item
          name="password"
          label="รหัสผ่าน"
          rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน!" }]}
        >
          <Input.Password placeholder="รหัสผ่าน" />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="ยืนยันรหัสผ่าน"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "กรุณายืนยันรหัสผ่าน!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("รหัสผ่านไม่ตรงกัน!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="ยืนยันรหัสผ่าน" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="เบอร์โทร"
          rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์!" }]}
        >
          <Input placeholder="เบอร์โทร" />
        </Form.Item>

        <Form.Item
          name="address"
          label="ที่อยู่"
          rules={[{ required: true, message: "กรุณากรอกที่อยู่!" }]}
        >
          <Input.TextArea placeholder="ที่อยู่" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            สมัครสมาชิก
          </Button>
        </Form.Item>
      </Form>

      {/* ✅ Modal Popup ยืนยันการสมัคร */}
      <Modal
        title="ยืนยันข้อมูล"
        open={isModalOpen}
        onOk={handleConfirmRegister} // ✅ กด "ยืนยัน" แล้วสมัครเลย
        onCancel={() => setIsModalOpen(false)}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>โปรดตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยันสมัครสมาชิก</p>
        <ul>
          <li>
            <b>ชื่อ:</b> {formValues?.firstName} {formValues?.lastName}
          </li>
          <li>
            <b>อีเมล:</b> {formValues?.email}
          </li>
          <li>
            <b>เบอร์โทร:</b> {formValues?.phone}
          </li>
          <li>
            <b>ที่อยู่:</b> {formValues?.address}
          </li>
        </ul>
      </Modal>
    </div>
  );
};
