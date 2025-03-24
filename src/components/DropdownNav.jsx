import { Avatar, Dropdown, Space } from "antd";
import { useNavigate } from "react-router";
import { authUser } from "../constrant";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
export const DropdownNav = () => {
  const navigate = useNavigate();
  const onClick = ({ key }) => {
    window.location.assign(key);
  };
  const items = [
    {
      label: "ทีมของฉัน",
      key: "/user/team",
    },
    {
      label: "ข้อมูลส่วนตัวของฉัน",
      key: "/user/me",
    },
    {
      label: "ออกจากระบบ",
      key: "/logout",
    },
  ];
  return (
    <div style={{ padding: "20px" }}>
      <Avatar style={{ alignItems: "center", backgroundColor: "#87d068" }}>
        {" "}
        {authUser.FirstName && authUser.LastName != null ? (
          authUser.FirstName.charAt(0) + authUser.LastName.charAt(0)
        ) : (
          <Avatar size={64} icon={<UserOutlined />} />
        )}
      </Avatar>
      <span style={{ fontSize: "14px", color: "white" }}>
        {" "}
        {authUser.FirstName} {authUser.LastName}
      </span>
      <Dropdown
        menu={{
          items,
          onClick,
        }}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
};
