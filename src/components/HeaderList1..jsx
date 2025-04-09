import React from "react";
import { Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Title } = Typography;

const HeaderList1 = () => {
  return (
    <Title
      level={3}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px",
        marginLeft: "20px",
        fontWeight: "bold",
        color: "#1890ff",
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: "30px", color: "#1890ff" }}>
        <EditOutlined />
      </span>
      จัดการผู้ใช้งาน
    </Title>
  );
};

export default HeaderList1;
