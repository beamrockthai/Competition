import React, { useState, useEffect } from "react";
import { Layout, Menu, theme, Button, Drawer, Dropdown, Modal } from "antd";
import {
  UserOutlined,
  TrophyOutlined,
  FileOutlined,
  MenuOutlined,
  SettingOutlined,
  UserAddOutlined,
  LogoutOutlined,
  DownOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useUserAuth } from "./Context/UserAuth"; // ดึงข้อมูลผู้ใช้จาก Context
import "./css/App.css";

const { Header, Content, Sider } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);
  const [drawerVisible, setDrawerVisible] = useState(false); // 🔹 เพิ่ม state สำหรับ Drawer

  const { user, role, logOut } = useUserAuth(); // 🔹 เพิ่ม role เพื่อใช้ในการควบคุมเมนู
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setMobileView(isMobile);
      setCollapsed(isMobile);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    Modal.confirm({
      title: "ต้องการออกจากระบบหรือไม่ ?",
      okText: "ตกลง",
      cancelText: "ยกเลิก",
      onOk: async () => {
        await logOut(); // ออกจากระบบ
        navigate("/login"); // เปลี่ยนหน้าไปที่หน้า Login
      },
      onCancel: () => {
        console.log("Logout cancelled");
      },
    });
  };

  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: <Link to="/userdashboard">รายการเเข่งขัน</Link>,
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Link to="/userregisteredlist">รายการที่คุณลงทะเบียน</Link>,
    },

    {
      key: "3",
      icon: <FileOutlined />,
      label: <Link to="/evaluation">Evaluation</Link>,
    },
    {
      key: "4",
      icon: <SettingOutlined />,
      label: <Link to="/setting">ตั้งค่า</Link>,
    },
    ...(role === "admin"
      ? [
          {
            key: "5",
            icon: <UserAddOutlined />,
            label: <Link to="/manage-directors">จัดการกรรมการ</Link>,
          },
          {
            key: "6",
            icon: <UserOutlined />,
            label: <Link to="/user-management">จัดการผู้ใช้</Link>,
          },

          {
            key: "7",
            icon: <TrophyOutlined />,
            label: <Link to="/admin-tournaments">สร้างการแข่งขัน</Link>,
          },
        ]
      : []),
  ];

  // Dropdown เมนูสำหรับผู้ใช้งาน
  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        โปรไฟล์
      </Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />}>
        ตั้งค่า
      </Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
        ออกจากระบบ
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Sidebar Menu */}
      {mobileView ? (
        <Drawer
          placement="left"
          closable
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
        >
          <Menu
            theme="light"
            mode="vertical"
            items={menuItems}
            onClick={() => setDrawerVisible(false)}
          />
        </Drawer>
      ) : (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={250}
          style={{
            height: "100vh",
            overflow: "auto",
            background: "#ffffff",
            boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Menu
            theme="light"
            mode="inline"
            items={menuItems}
            style={{ borderRight: "none", marginTop: "16px" }}
          />
        </Sider>
      )}

      <Layout>
        {/* Header */}
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            height: 64,
            background: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {mobileView && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
            />
          )}
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "bold",
              color: "#b12341",
            }}
          >
            <AppstoreOutlined /> COMP
          </h2>
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <Button>
              {user?.name || "ผู้ใช้งาน"} <DownOutlined />
            </Button>
          </Dropdown>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: "16px",
            padding: "24px",
            background: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
