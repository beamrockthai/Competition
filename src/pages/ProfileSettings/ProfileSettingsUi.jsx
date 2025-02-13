import React, { useEffect } from "react";
import { Form, Input, Button, Typography, Select, Row, Col } from "antd";
import { useProfileSettings } from "../../services/ProfileSetting"; // ✅ Import Logic

const { Title } = Typography;
const { Option } = Select;

const ProfileSettingUI = () => {
  const [form] = Form.useForm();
  const { initialValues, loading, updateProfile } = useProfileSettings(); // ✅ ใช้ Logic ที่แยกออกมา

  // เมื่อ initialValues ถูกโหลด ให้เซ็ตค่าลงใน form
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  return (
    <div
      style={{
        maxWidth: 800, // ✅ ขยายขนาดให้เหมาะสม
        margin: "2rem auto",
        padding: "2rem",
        background: "#f0f2f5",
        borderRadius: "8px",
      }}
    >
      <Title level={3} style={{ textAlign: "left", color: "#ff4d4f" }}>
        ข้อมูลพื้นฐาน{" "}
        <span style={{ color: "#ff4d4f", fontSize: "18px" }}>🔴</span>
      </Title>

      <Form form={form} layout="vertical" onFinish={updateProfile}>
        <Row gutter={16}>
          {/* ชื่อ */}
          <Col xs={24} sm={12}>
            <Form.Item
              label="ชื่อ*"
              name="firstName"
              rules={[{ required: true, message: "กรุณากรอกชื่อ!" }]}
            >
              <Input placeholder="ชื่อ" />
            </Form.Item>
          </Col>

          {/* นามสกุล */}
          <Col xs={24} sm={12}>
            <Form.Item
              label="นามสกุล*"
              name="lastName"
              rules={[{ required: true, message: "กรุณากรอกนามสกุล!" }]}
            >
              <Input placeholder="นามสกุล" />
            </Form.Item>
          </Col>
        </Row>

        {/* ที่อยู่ */}
        <Form.Item
          label="ที่อยู่*"
          name="address"
          rules={[{ required: true, message: "กรุณากรอกที่อยู่!" }]}
        >
          <Input.TextArea placeholder="ที่อยู่" rows={3} />
        </Form.Item>

        {/* เบอร์โทร */}
        <Form.Item
          label="เบอร์โทร*"
          name="phone"
          rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์!" }]}
        >
          <Input placeholder="เบอร์โทร" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            บันทึกข้อมูล
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfileSettingUI;
