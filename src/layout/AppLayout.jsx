import {
  AppstoreAddOutlined,
  HomeOutlined,
  UserOutlined,
  DownOutlined,
  FireOutlined,
} from "@ant-design/icons";

import {
  Avatar,
  Layout,
  Menu,
  message,
  ConfigProvider,
  Dropdown,
  Space,
  Typography,
  Button,
  Drawer,
} from "antd";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { Header } from "antd/es/layout/layout";
import { authUser } from "../constrant";
import { TeamPage } from "../pages/imac/Team/Team";
import { DropdownNav } from "../components/DropdownNav";
const { Content, Footer, Sider } = Layout;

export const AppLayout = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false); // State for Drawer visibility

  const toggleDrawer = () => {
    setVisible(!visible); // Toggle Drawer visibility
  };

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
            color: "white",
            backgroundColor: "#303030",
          }}
        >
          <div>
            <img
              style={{ marginTop: "20px" }}
              height="50px"
              src="/src/assets/ITED-LOGO.jpg"
              alt="logo"
            />
          </div>
          <div style={{ paddingLeft: "5px", lineHeight: "1" }}>
            <span style={{ fontSize: "20px", display: "block" }}>
              สำนักพัฒนาเทคนิคศึกษา
            </span>
            <span style={{ fontSize: "9px", display: "block" }}>
              Institute For Technical Education Development
            </span>
          </div>

          {/* Menu for larger screens */}
          <div className="menu-desktop">
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={location.pathname}
              className="custom-menu"
              onClick={({ key }) => {
                navigate(key);
              }}
              style={{
                flex: 1,
                minWidth: 0,
                backgroundColor: "#303030",
                fontWeight: "bold",
                fontSize: "20px",
                marginLeft: "20px",
              }}
              items={[
                { label: "HOME", key: "/" },
                { label: "ABOUT", key: "/about" },
                { label: "ROAD MAP", key: "/roadmap" },
                { label: "OUR TEAM", key: "/ourteam" },
                { label: "CONTACT", key: "/contact" },
              ]}
            />
          </div>

          {/* Hamburger Button for smaller screens */}
          <Button
            type="text"
            className="hamburger-button"
            style={{ color: "white", marginLeft: "auto" }}
            onClick={toggleDrawer}
          >
            <DownOutlined />
          </Button>
          {authUser != null ? (
            <DropdownNav />
          ) : (
            <Button href="/userlogin" style={{ color: "white" }} type="text">
              Login/Register
            </Button>
          )}
        </Header>

        {/* Drawer Menu for mobile */}
        <Drawer
          title="Menu"
          placement="right"
          onClose={toggleDrawer}
          visible={visible}
          width={250}
        >
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => {
              navigate(key);
              setVisible(false); // Close drawer after selecting an item
            }}
            items={[
              { label: "HOME", key: "/" },
              { label: "ABOUT", key: "/about" },
              { label: "ROAD MAP", key: "/roadmap" },
              { label: "OUR TEAM", key: "/ourteam" },
              { label: "CONTACT", key: "/contact" },
            ]}
          />
        </Drawer>

        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              fontFamily: "CPAC_MODERN_MEDIUM",
            }}
          >
            {props.children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          ITED MEDIA ACADEMY CONTEST ©2025 - {dayjs().format("YYYY")} ITED
          KMUTNB
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};
