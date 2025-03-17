import {
  AppstoreAddOutlined,
  HomeOutlined,
  UserOutlined,
  DownOutlined,
  FireOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Layout,
  Menu,
  ConfigProvider,
  Dropdown,
  Button,
  Drawer,
} from "antd";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { Header } from "antd/es/layout/layout";
import { useMediaQuery } from "react-responsive"; // ตรวจสอบขนาดหน้าจอ
import { authUser } from "../constrant";
import { DropdownNav } from "../components/DropdownNav";

const { Content, Footer } = Layout;

export const AppLayout = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  // ตรวจสอบว่าเป็น Mobile หรือไม่
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const toggleDrawer = () => {
    setVisible(!visible);
  };

  const menuItems = [
    { label: "HOME", key: "/" },
    { label: "ABOUT", key: "/about" },
    { label: "ROAD MAP", key: "/roadmap" },
    { label: "OUR TEAM", key: "/ourteam" },
    { label: "CONTACT", key: "/contact" },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgLayout: "#000000",
        },
      }}
    >
      <Layout>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            backgroundColor: "#303030",
          }}
        >
          {/* โลโก้ */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img height="50px" src="/src/assets/ITED-LOGO.jpg" alt="logo" />
            <div style={{ paddingLeft: "10px", color: "white" }}>
              <span style={{ fontSize: "18px", display: "block" }}>
                สำนักพัฒนาเทคนิคศึกษา
              </span>
              <span style={{ fontSize: "10px", display: "block" }}>
                {/* Institute For Technical Education Development */}
              </span>
            </div>
          </div>

          {/* เมนู Desktop */}
          {!isMobile && (
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[location.pathname]}
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "transparent",
                fontWeight: "bold",
                fontSize: "16px",
              }}
              onClick={({ key }) => navigate(key)}
              items={menuItems.map((item) => ({
                ...item,
                style: {
                  color: location.pathname === item.key ? "white" : "orange", // ถ้าเลือกแล้วให้เป็นสีขาว ถ้ายังไม่ได้เลือกเป็นสีส้ม
                  backgroundColor:
                    location.pathname === item.key
                      ? "rgba(255, 165, 0, 0.3)"
                      : "transparent", // พื้นหลังเมนูที่ถูกเลือกให้เป็นสีส้มอ่อน
                  transition: "all 0.3s ease", // เพิ่มเอฟเฟกต์ให้ smooth
                },
                onMouseEnter: (e) => {
                  if (location.pathname !== item.key)
                    e.target.style.color = "white"; // เปลี่ยนเป็นสีขาวเมื่อ hover ถ้าไม่ได้ถูกเลือกอยู่
                },
                onMouseLeave: (e) => {
                  if (location.pathname !== item.key)
                    e.target.style.color = "orange"; // กลับเป็นสีส้มเมื่อออกจาก hover ถ้าไม่ได้ถูกเลือกอยู่
                },
              }))}
            />
          )}

          {/* ปุ่มเมนู Hamburger สำหรับ Mobile */}
          {isMobile ? (
            <Button
              type="text"
              style={{ color: "white" }}
              onClick={toggleDrawer}
            >
              <MenuOutlined style={{ fontSize: "20px" }} />
            </Button>
          ) : authUser ? (
            <DropdownNav />
          ) : (
            <Button href="/userlogin" style={{ color: "white" }} type="text">
              เข้าสู่ระบบ/สมัครสมาชิก
            </Button>
          )}
        </Header>

        {/* Drawer สำหรับ Mobile Menu */}
        <Drawer
          title="Menu"
          placement="right"
          onClose={toggleDrawer}
          open={visible}
          width={250}
        >
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => {
              navigate(key);
              setVisible(false);
            }}
            items={menuItems}
          />
        </Drawer>

        {/* Content */}
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ padding: 24, minHeight: 360 }}>{props.children}</div>
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: "center", padding: "12px 24px" }}>
          ITED MEDIA ACADEMY CONTEST ©2025 - {dayjs().format("YYYY")} ITED
          KMUTNB
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};
