// App.jsx

import React, { useState, useEffect } from "react";
import { Layout, Menu, theme, Button, Drawer } from "antd";
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

const { Header, Content, Sider } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);

  const { user, logOut } = useUserAuth();
  const navigate = useNavigate();

  // ติดตามขนาดหน้าจอเพื่อตัดสินใจแสดง Drawer (มือถือ) หรือ Sider (PC)
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ฟังก์ชัน Logout
  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  // เมนูย่อยต่าง ๆ จะใช้ Link ไป path ตามที่กำหนดใน index.jsx
  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: <Link to="/">Dashboard</Link>,
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
    {
      key: "5",
      icon: <UserAddOutlined />,
      label: <Link to="/manage directors">Manage Directors</Link>,
    },
  ];

  return (
    <Layout>
      {/* ถ้าหน้าจอเล็ก (mobileView) จะแสดง Drawer */}
      {mobileView ? (
        <Drawer
          title="Menu"
          placement="left"
          closable={true}
          onClose={() => setCollapsed(false)}
          open={collapsed}
        >
          <Menu theme="light" mode="vertical" items={menuItems} />
        </Drawer>
      ) : (
        // ถ้าหน้าจอใหญ่ (PC) ให้ใช้ Sider
        <Sider
          breakpoint="lg"
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{
            position: "fixed",
            top: 0,
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
            style={{ color: "#000" }}
          />
        </Sider>
      )}

      {/* ส่วน Layout ด้านขวา */}
      <Layout style={{ marginLeft: mobileView ? 0 : collapsed ? 80 : 200 }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            transition: "all 0.3s",
          }}
        >
          {/* ปุ่มแฮมเบอร์เกอร์ เมนู (เฉพาะหน้าจอเล็ก) */}
          {mobileView && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setCollapsed(true)}
              style={{ fontSize: "18px", marginLeft: "16px" }}
            />
          )}
          <h2
            style={{
              color: "#1890ff",
              textAlign: "center",
              width: "100%",
              margin: 0,
            }}
          >
            MY COMP
          </h2>

          {user && (
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ marginLeft: "auto" }}
            >
              Logout
            </Button>
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
            {/* ส่วนที่จะเอาไว้แสดงหน้าลูก (children) ตามเส้นทางใน index.jsx */}
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
