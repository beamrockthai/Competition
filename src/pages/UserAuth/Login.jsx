// components/UserAuth/Login.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  AlipayOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoOutlined,
  UserOutlined,
  WeiboOutlined,
  WindowsOutlined,
  CodeSandboxOutlined,
} from "@ant-design/icons";
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, Divider, Space, Tabs, message, theme } from "antd";
import { useUserAuth } from "../../Context/UserAuth";

const Login = () => {
  const [loginType, setLoginType] = useState("account");
  const [loading, setLoading] = useState(false);
  const { token } = theme.useToken();
  const { user, logIn } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      await logIn(values.username, values.password);
      message.success("ล็อกอินเข้าสู่ระบบเรียบร้อย");
      navigate("/");
    } catch (error) {
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
    <ProConfigProvider dark>
      <div style={{ backgroundColor: "white", height: "100vh" }}>
        <LoginFormPage
          backgroundVideoUrl="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4"
          logo={
            <CodeSandboxOutlined style={{ fontSize: 50, color: "#DC143C" }} />
          }
          title="Compatition"
          subTitle="ระบบการเเข่งขันกีฬา"
          onFinish={handleLogin}
          submitter={{
            searchConfig: {
              submitText: "ล็อกอิน",
            },
            submitButtonProps: {
              loading,
            },
          }}
          containerStyle={{
            backgroundColor: "rgba(0, 0, 0,0.65)",
            backdropFilter: "blur(4px)",
          }}
          activityConfig={{
            style: {
              boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
              color: token.colorTextHeading,
              borderRadius: 8,
              backgroundColor: "rgba(220, 20, 60)",
              backdropFilter: "blur(4px)",
            },
            title: "กิจกรรมแนะนำ",
            subTitle: "ลงชื่อเข้าใช้งานเพื่อรับสิทธิพิเศษ",
            // action: (
            //   <Button
            //     size="large"
            //     style={{
            //       borderRadius: 20,
            //       background: token.colorBgElevated,
            //       color: token.colorPrimary,
            //       width: 120,
            //     }}
            //   >
            //     เริ่มเลย
            //   </Button>
            // ),
          }}
          // actions={
          //   <div style={{ textAlign: "center" }}>
          //     <Divider plain>
          //       <span style={{ color: token.colorTextPlaceholder }}>
          //         เข้าสู่ระบบด้วยบัญชีอื่น
          //       </span>
          //     </Divider>
          //     <Space size={24}>
          //       <AlipayOutlined style={{ fontSize: 24, color: "#1677FF" }} />
          //       <TaobaoOutlined style={{ fontSize: 24, color: "#FF6A10" }} />
          //       <WeiboOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          //     </Space>
          //   </div>
          // }
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={(key) => setLoginType(key)}
          >
            <Tabs.TabPane key="account" tab="บัญชีผู้ใช้" />
            {/* <Tabs.TabPane key="phone" tab="เบอร์โทรศัพท์" /> */}
          </Tabs>

          {loginType === "account" && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: "large",
                  prefix: <UserOutlined />,
                }}
                placeholder="Email"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกอีเมล",
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined />,
                }}
                placeholder="รหัสผ่าน"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกรหัสผ่าน",
                  },
                ]}
              />
            </>
          )}

          {/* {loginType === "phone" && (
            <>
              <ProFormText
                name="mobile"
                fieldProps={{
                  size: "large",
                  prefix: <MobileOutlined />,
                }}
                placeholder="เบอร์โทรศัพท์"
                rules={[
                  { required: true, message: "กรุณากรอกเบอร์โทรศัพท์" },
                  { pattern: /^0\d{9}$/, message: "รูปแบบเบอร์ไม่ถูกต้อง" },
                ]}
              />
              <ProFormCaptcha
                name="captcha"
                placeholder="กรอกรหัสยืนยัน"
                onGetCaptcha={async () => {
                  message.success("ส่งรหัส OTP แล้ว (mock: 1234)");
                }}
                rules={[
                  { required: true, message: "กรุณากรอกรหัสยืนยัน" },
                ]}
                captchaTextRender={(timing, count) =>
                  timing ? `${count} วินาที` : "ขอรหัสยืนยัน"
                }
              />
            </>
          )} */}

          <div style={{ marginBottom: 26 }}>
            {/* <a style={{ float: "right"  }} href="/register">สมัครเข้าสู่ระบบ</a> */}
            <Link to="/register">สมัครสมาชิกเข้าสู่ระบบ</Link>
          </div>
        </LoginFormPage>
      </div>
    </ProConfigProvider>
  );
};

export default Login;
