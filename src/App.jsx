import React, { useState, useEffect } from "react";
import { Layout, Menu, theme, Button, Drawer, Dropdown } from "antd";
import {
  UserOutlined,
  TrophyOutlined,
  FileOutlined,
  MenuOutlined,
  SettingOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useUserAuth } from "./Context/UserAuth"; // ดึงข้อมูลผู้ใช้จาก Context
import "./css/App.css";
import { AppstoreOutlined, DownOutlined } from "@ant-design/icons";
import { Modal } from "antd"; // นำเข้า Modal จาก Ant Design

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
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <TrophyOutlined />,
      label: <Link to="/tournaments">Tournaments</Link>,
    },
    {
      key: "3",
      icon: <FileOutlined />,
      label: <Link to="/evaluation">Evaluation</Link>,
    },
    {
      key: "4",
      icon: <SettingOutlined />,
      label: <Link to="/setting">Setting</Link>,
    },
    ...(role === "admin"
      ? [
          {
            key: "5",
            icon: <UserAddOutlined />,
            label: <Link to="/manage-directors">Manage Directors</Link>,
          },
          {
            key: "6",
            icon: <UserOutlined />,
            label: <Link to="/user-management">User Management</Link>,
          },
        ]
      : []),
  ];

  // Dropdown เมนูสำหรับผู้ใช้งาน
  const userMenu = (
    <Menu>
      <Menu.Item key="1" onClick={handleLogout} icon={<UserOutlined />}>
        โปรไฟล์
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout} icon={<SettingOutlined />}>
        ตั้งค่า
      </Menu.Item>

      <Menu.Item
        key="3"
        style={{ color: "#fe000" }}
        onClick={handleLogout}
        icon={<LogoutOutlined />}
      >
        ออกจากระบบ
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      {mobileView ? (
        <Drawer
          title="Menu"
          placement="left"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
        >
          <Menu
            theme="light"
            mode="vertical"
            items={menuItems}
            className="custom-menu"
            onClick={() => setDrawerVisible(false)}
          />
        </Drawer>
      ) : (
        <Sider
          breakpoint="lg"
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{
            position: "fixed",
            top: 95,
            left: 0,
            bottom: 0,
            backgroundColor: "#fff",
            zIndex: 100,
            transition: "all 0.3s",
          }}
        >
          <Menu
            theme="light"
            mode="inline"
            items={menuItems}
            className="custom-menu"
            style={{ color: "#000" }}
          />
        </Sider>
      )}

      <Layout
        style={{
          marginLeft: mobileView ? 0 : collapsed ? 80 : 200,
          transition: "all 0.3s",
        }}
      >
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            transition: "all 0.3s",
          }}
        >
          {mobileView && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              style={{ fontSize: "18px", marginLeft: "16px" }}
            />
          )}
          <h2
            style={{
              fontSize: "27px",
              color: "#b12341",
              textAlign: "center",
              width: "100%",
              margin: 0,
            }}
          >
            <AppstoreOutlined />
            COMP
          </h2>

          {user && (
            <Dropdown overlay={userMenu}>
              <Button
                icon={<UserOutlined />}
                type="text"
                style={{ marginLeft: "auto" }}
              >
                ธัชนนท์ <DownOutlined />
              </Button>
            </Dropdown>
          )}
        </Header>

        <Content
          style={{
            margin: "24px 16px 0",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            transition: "all 0.3s",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
