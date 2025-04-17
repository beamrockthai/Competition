import React from "react";
import { Typography } from "antd";
import { BoxPlotOutlined } from "@ant-design/icons";

const { Title } = Typography;

const DashboardHeader3 = () => {
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
        <BoxPlotOutlined />
      </span>
      ข้อดีของการเล่นกีฬา
    </Title>
  );
};

export default DashboardHeader3;
