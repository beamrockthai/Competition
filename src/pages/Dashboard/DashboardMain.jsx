import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography } from "antd";
import {
  UserOutlined,
  TrophyOutlined,
  CalendarOutlined,
  DashboardOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import moment from "moment";
import "moment/locale/th"; // นำเข้าภาษาไทย

const { Title } = Typography;

const Dashboard = () => {
  const [competitorCount, setCompetitorCount] = useState(0); // จำนวนผู้เข้าแข่งขัน
  const [directorCount, setDirectorCount] = useState(0); // จำนวนกรรมการ
  const [tournamentCount, setTournamentCount] = useState(0); // จำนวนกีฬา

  // ✅ อัปเดต locale ภาษาไทยด้วย `updateLocale`
  useEffect(() => {
    moment.updateLocale("th", {
      months: [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ],
      weekdays: [
        "อาทิตย์",
        "จันทร์",
        "อังคาร",
        "พุธ",
        "พฤหัสบดี",
        "ศุกร์",
        "เสาร์",
      ],
    });
  }, []);

  const todayDate = moment().format("D MMMM YYYY"); // ✅ วันที่ปัจจุบัน เช่น "4 กุมภาพันธ์ 2566"

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึงข้อมูล Users
        const userQuerySnapshot = await getDocs(collection(db, "users"));
        const users = userQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // กรองข้อมูล
        setCompetitorCount(users.filter((user) => user.role === "user").length);
        setDirectorCount(
          users.filter((user) => user.role === "director").length
        );

        // ดึงข้อมูล Tournaments
        const tournamentQuerySnapshot = await getDocs(
          collection(db, "tournaments")
        );
        setTournamentCount(tournamentQuerySnapshot.size); // นับจำนวนกีฬา
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const statistics = [
    {
      title: "วันที่",
      value: todayDate, // ✅ วันที่ในภาษาไทย
      icon: <CalendarOutlined />,
      color: "#00bcd4", // สีพื้นหลัง
    },
    {
      title: "จํานวนผู้เข้าเเข่งขัน",
      value: competitorCount, // จำนวนผู้เข้าแข่งขัน
      icon: <UserOutlined />,
      color: "#1890ff",
    },
    {
      title: "จํานวนกีฬา",
      value: tournamentCount, // จำนวนกีฬา
      icon: <TrophyOutlined />,
      color: "#52c41a",
    },
    {
      title: "จํานวนกรรมการ",
      value: directorCount, // จำนวนกรรมการ
      icon: <UserOutlined />,
      color: "#faad14",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
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
        <span
          style={{
            fontSize: "30px",
            color: "#1890ff",
          }}
        >
          <BarChartOutlined />
        </span>
        Dashboard
      </Title>

      <Row gutter={[16, 16]}>
        {statistics.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card
              bordered={false}
              style={{
                backgroundColor: stat.color,
                color: "#fff",
                borderRadius: "8px",
              }}
              bodyStyle={{ padding: "20px" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ fontSize: "40px", marginRight: "10px" }}>
                  {stat.icon}
                </div>
                <div>
                  <Title level={2} style={{ margin: 0, color: "#fff" }}>
                    {stat.value}
                  </Title>
                  <span>{stat.title}</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;
