import {
  AppstoreAddOutlined,
  HomeOutlined,
  UserOutlined,
  DownOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

import {
  Avatar,
  Layout,
  Menu,
  message,
  ConfigProvider,
  Dropdown,
  Space,
} from "antd";
import { authUser, ImgUrl } from "../constrant";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginPage } from "../pages/Login";
import dayjs from "dayjs";

const { Content, Footer, Sider } = Layout;

export const AdminLayout = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!authUser) {
    message.destroy();
    message.warning("กรุณาเข้าสู่ระบบ");
    return <LoginPage />;
  }
  const onClick = ({ key }) => {
    message.info(`Click on item ${key}`);
    window.location.assign("/logout");
  };
  const items = [
    {
      label: "ออกจากระบบ",
      key: "/logout",
    },
  ];
  return (
    // <ConfigProvider
    //   theme={{
    //     token: {
    //       // fontFamily: "CPAC_MODERN_MEDIUM",
    //       lightSiderBg: "#013366",
    //     },
    //   }}
    // >
    <Layout style={{ height: "100vh", width: "100%" }}>
      <Sider
        theme="dark"
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        style={{ maxHeight: "100%" }}
      >
        <div style={{ padding: "20px" }}>
          {authUser.ProfilePicture !== null ? (
            <Avatar src={ImgUrl + authUser.ProfilePictureURL} />
          ) : (
            <Avatar
              style={{ alignItems: "center", backgroundColor: "#87d068" }}
            >
              {authUser.FirstName && authUser.LastName != null ? (
                authUser.FirstName.charAt(0) + authUser.LastName.charAt(0)
              ) : (
                <Avatar size={64} icon={<UserOutlined />} />
              )}
            </Avatar>
          )}{" "}
          <span style={{ fontSize: "16px", color: "white" }}>สวัสดี Admin</span>
          <Dropdown
            menu={{
              items,
              onClick,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <span style={{ fontSize: "16px", color: "white" }}>
                  {authUser.FirstName} {authUser.LastName}
                </span>
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={location.pathname}
          onClick={({ key }) => {
            navigate(key);
          }}
        >
          <Menu.Divider />
          <Menu.Item key="/admin" icon={<DashboardOutlined />}>
            <span style={{ fontWeight: "bold" }}>Dashboard</span>
          </Menu.Item>
          <Menu.Item key="/admin/teamstatus" icon={<AppstoreAddOutlined />}>
            <span style={{ fontWeight: "bold" }}>สถานะทีม</span>
          </Menu.Item>
          <Menu.Item key="/admin/roundconfig" icon={<AppstoreAddOutlined />}>
            <span style={{ fontWeight: "bold" }}>กำหนดรอบแข่งขัน</span>
          </Menu.Item>
          <Menu.Item key="/admin/tournament" icon={<AppstoreAddOutlined />}>
            <span style={{ fontWeight: "bold" }}>ประเภทแข่งขัน</span>
          </Menu.Item>
          <Menu.Item key="/admin/managedirector" icon={<AppstoreAddOutlined />}>
            <span style={{ fontWeight: "bold" }}>จัดการกรรมการ</span>
          </Menu.Item>
          <Menu.Item key="/admin/evaluation" icon={<AppstoreAddOutlined />}>
            <span style={{ fontWeight: "bold" }}>แบบประเมิน</span>
          </Menu.Item>
          <Menu.Item key="/admin/teammanagement" icon={<AppstoreAddOutlined />}>
            <span style={{ fontWeight: "bold" }}>จัดการทีม</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content
          style={{
            margin: "24px 16px 0",
            height: "100vh",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "white",
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
    </Layout>
    // </ConfigProvider>
  );
};
