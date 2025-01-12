import React from "react";
import { Tournaments } from "../Tournaments/Tournaments"; // ตรวจสอบเส้นทางการนำเข้า
import { Statistic, Row, Col } from "antd"; // นำเข้า Statistic, Row, Col จาก antd
import { LikeOutlined } from "@ant-design/icons"; // นำเข้าไอคอนจาก antd

export const Dashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      {/* ส่วนแสดงสถิติ */}
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Feedback" value={1128} prefix={<LikeOutlined />} />
        </Col>
        <Col span={12}>
          <Statistic title="Unmerged" value={93} suffix="/ 100" />
        </Col>
      </Row>

      {/* ส่วนแสดงคอมโพเนนต์ Tournaments */}
      <Tournaments highlight={true} />
    </div>
  );
};
