import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LoginFormPage,
  ProFormText,
  ProFormTextArea,
  ProForm,
  ProConfigProvider,
} from "@ant-design/pro-components";
import { Button, Modal, message, theme, ConfigProvider } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useUserAuth } from "../../Context/UserAuth";
import thTH from "antd/locale/th_TH";
// import CardIntro from "../../components/Card";

const Register = () => {
  const [formValues, setFormValues] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = theme.useToken();
  const { user, signUpUser } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const showConfirmModal = (values) => {
    setFormValues(values);
    setIsModalOpen(true);
  };

  const handleConfirmRegister = async () => {
    setLoading(true);
    setIsModalOpen(false);

    try {
      const { email, password, firstName, lastName, address, phone } =
        formValues;
      await signUpUser(email, password, firstName, lastName, address, phone);
      message.success("สมัครสมาชิกสำเร็จ!");
      navigate("/");
    } catch (error) {
      console.log("Register error:", error.code, error.message);
      message.error("สมัครสมาชิกไม่สำเร็จ: " + error.message);
    }

    setLoading(false);
  };

  return (
    <ProConfigProvider dark>
      <ConfigProvider locale={thTH}>
        <div
          style={{
            height: "100vh",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#141414",
          }}
        >
          {/* <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end", // ✅ ขยับเข้าในแนวนอน
              alignItems: "center", // ✅ จัดให้อยู่กลางแนวตั้ง
              paddingRight: 40, // ✅ ขยับให้ห่างจากขอบซ้าย
            }}
          >
            <CardIntro />
          </div> */}

          <LoginFormPage
            title="สมัครสมาชิก"
            subTitle="กรุณากรอกข้อมูลให้ครบถ้วน"
            backgroundVideoUrl="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4"
            containerStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(6px)",
              borderRadius: 12,
              boxShadow: "0 0 10px rgba(0,0,0,0.6)",
              maxWidth: 500,
              width: "100%",
            }}
            // logo={<UserOutlined style={{ fontSize: 32, color: "#1890ff" }} />}
            submitter={{
              searchConfig: { submitText: "สมัครสมาชิก" },
              submitButtonProps: { loading },
            }}
            onFinish={showConfirmModal}
          >
            <ProForm.Group>
              <ProFormText
                name="firstName"
                label="ชื่อ"
                placeholder="ชื่อ"
                rules={[{ required: true, message: "กรุณากรอกชื่อ!" }]}
                fieldProps={{ prefix: <UserOutlined /> }}
              />
              <ProFormText
                name="lastName"
                label="นามสกุล"
                placeholder="นามสกุล"
                rules={[{ required: true, message: "กรุณากรอกนามสกุล!" }]}
                fieldProps={{ prefix: <UserOutlined /> }}
              />
            </ProForm.Group>

            <ProFormText
              name="email"
              label="อีเมล"
              placeholder="อีเมล"
              rules={[
                { required: true, message: "กรุณากรอกอีเมล!" },
                { type: "email", message: "อีเมลไม่ถูกต้อง!" },
              ]}
              fieldProps={{ prefix: <UserOutlined /> }}
            />

            <ProForm.Group>
              <ProFormText.Password
                name="password"
                label="รหัสผ่าน"
                placeholder="รหัสผ่าน"
                rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน!" }]}
                fieldProps={{ prefix: <LockOutlined /> }}
              />
              <ProFormText.Password
                name="confirm"
                label="ยืนยันรหัสผ่าน"
                placeholder="ยืนยันรหัสผ่าน"
                dependencies={["password"]}
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
                fieldProps={{ prefix: <LockOutlined /> }}
              />
            </ProForm.Group>

            <ProFormText
              name="phone"
              label="เบอร์โทร"
              placeholder="เบอร์โทรศัพท์"
              rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์!" }]}
              fieldProps={{ prefix: <MobileOutlined /> }}
            />

            <ProFormTextArea
              name="address"
              label="ที่อยู่"
              placeholder="ที่อยู่"
              rules={[{ required: true, message: "กรุณากรอกที่อยู่!" }]}
              fieldProps={{ prefix: <HomeOutlined /> }}
            />
          </LoginFormPage>

          {/* Modal Popup */}
          <Modal
            title="ยืนยันข้อมูล"
            open={isModalOpen}
            onOk={handleConfirmRegister}
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
      </ConfigProvider>
    </ProConfigProvider>
  );
};

export default Register;
