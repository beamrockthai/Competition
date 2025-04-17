import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Select,
  Row,
  Col,
  Space,
  Divider,
} from "antd";
import { useProfileSettings } from "../../services/ProfileSetting";

const { Title } = Typography;
const { Option } = Select;

const ProfileSettingUI = () => {
  const [form] = Form.useForm();
  const { initialValues, loading, updateProfile } = useProfileSettings();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "3rem auto",
        padding: "2.5rem",
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
      }}
    >
      <Title
        level={3}
        style={{
          marginBottom: "2.0rem",
          color: "#b12341",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        จัดการข้อมูลส่วนตัว
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={updateProfile}
        size="middle"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="ชื่อ*"
              name="firstName"
              rules={[{ required: true, message: "กรุณากรอกชื่อ!" }]}
            >
              <Input placeholder="เช่น ธัชนนท์" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="นามสกุล*"
              name="lastName"
              rules={[{ required: true, message: "กรุณากรอกนามสกุล!" }]}
            >
              <Input placeholder="เช่น รอดวงษ์" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item
              label="ที่อยู่*"
              name="address"
              rules={[{ required: true, message: "กรุณากรอกที่อยู่!" }]}
            >
              <Input.TextArea
                placeholder="บ้านเลขที่ / หมู่บ้าน / ถนน / ตำบล / อำเภอ / จังหวัด / รหัสไปรษณีย์"
                rows={3}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item
              label="เบอร์โทร*"
              name="phone"
              rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์!" }]}
            >
              <Input placeholder="เช่น 0891234567" />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Form.Item style={{ marginTop: 20 }}>
          <Button
            danger
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            style={{ borderRadius: "8px" }}
          >
            บันทึกข้อมูล
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfileSettingUI;
