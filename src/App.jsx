import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu, theme, Button, Drawer } from "antd";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  TrophyOutlined,
  FileOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Tournaments } from "./components/Tournaments/Tournaments";
import { Evaluation } from "./components/Evaluation/evaluation";
import { Dashboard } from "./components/Dashboard/Dashboard";

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { key: "1", icon: <UserOutlined />, label: <Link to="/">Dashboard</Link> },

    {
      key: "2",
      icon: <VideoCameraOutlined />,
      label: <Link to="/videos">Videos</Link>,
    },

    {
      key: "3",
      icon: <TrophyOutlined />,
      label: <Link to="/tournaments">Tournaments</Link>,
    },

    {
      key: "4",
      icon: <FileOutlined />,
      label: <Link to="/evaluation">Evaluation</Link>,
    },
  ];

  return (
    <Router>
      <Layout>
        {mobileView ? (
          <Drawer
            title="Menu"
            placement="left"
            closable={true}
            onClose={() => setCollapsed(false)}
            open={collapsed}
          >
            <Menu mode="vertical" items={menuItems} />
          </Drawer>
        ) : (
          <Sider
            breakpoint="lg"
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
          >
            <div className="demo-logo-vertical" />
            <Menu theme="dark" mode="inline" items={menuItems} />
          </Sider>
        )}

        <Layout>
          <Header
            style={{
              display: "flex",
              alignItems: "center",
              background: colorBgContainer,
            }}
          >
            {mobileView && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setCollapsed(true)}
                style={{ fontSize: "18px", marginLeft: "16px" }}
              />
            )}
            <h2 style={{ marginLeft: "16px", color: "#1890ff" }}>MY COMP</h2>
          </Header>

          <Content
            style={{
              margin: "24px 16px 0",
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
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
              <Routes>
                <Route path="/" element={<null />} />
                <Route path="/videos" element={<h1>Videos Page</h1>} />
                <Route path="/evaluation" element={<Evaluation />} />
                <Route path="/tournaments" element={<Tournaments />} />
              </Routes>
            </div>
          </Content>

          <Footer style={{ textAlign: "center" }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
