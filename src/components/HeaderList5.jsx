import React from "react";
import { Typography } from "antd";
import { HighlightOutlined } from "@ant-design/icons";

const { Title } = Typography;

const HeaderList5 = () => {
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
        color: "#b12341",
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: "30px", color: "#b12341" }}>
        <HighlightOutlined />
      </span>
      รายการที่ผู้เข้าเเข่งขันลงทะเบียน
    </Title>
  );
};

export default HeaderList5;
