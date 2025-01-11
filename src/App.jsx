import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu, theme } from "antd";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Tournaments } from "./components/Tournaments/Tournaments";

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Router>
      <Layout>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="demo-logo-vertical" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              <Link to="/videos">Videos</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              <Link to="/upload">Upload</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<TrophyOutlined />}>
              <Link to="/tournaments">Tournaments</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content
            style={{
              margin: "24px 16px 0",
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh", // ทำให้ Content มีความสูงเต็มหน้าจอ
            }}
          >
            <div
              style={{
                flex: 1, // ทำให้เนื้อหากลางมีความยืดหยุ่น
                padding: 24,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Routes>
                <Route path="/" element={<h1>Welcome to Comp</h1>} />
                <Route path="/videos" element={<h1>Videos Page</h1>} />
                <Route path="/upload" element={<h1>Upload Page</h1>} />
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
