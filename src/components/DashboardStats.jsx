import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography } from "antd";
import {
  UserOutlined,
  TrophyOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import moment from "moment";
import "moment/locale/th";

const { Title } = Typography;

const DashboardStats = () => {
  const [stats, setStats] = useState({
    competitorCount: 0,
    directorCount: 0,
    tournamentCount: 0,
    todayDate: moment().format("D MMMM YYYY"),
  });

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

    const fetchStats = async () => {
      try {
        const userSnapshot = await getDocs(collection(db, "users"));
        const users = userSnapshot.docs.map((doc) => doc.data());

        const competitorCount = users.filter((u) => u.role === "user").length;
        const directorCount = users.filter((u) => u.role === "director").length;

        const tournamentSnapshot = await getDocs(collection(db, "tournaments"));

        setStats({
          competitorCount,
          directorCount,
          tournamentCount: tournamentSnapshot.size,
          todayDate: moment().format("D MMMM YYYY"),
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      title: "วันที่",
      value: stats.todayDate,
      icon: <CalendarOutlined />,
      color: "#b12341",
    },
    {
      title: "จํานวนทีมเเข่งขัน",
      value: stats.competitorCount,
      icon: <UserOutlined />,
      color: "#b12341",
    },
    {
      title: "รายการเเข่งขัน",
      value: stats.tournamentCount,
      icon: <TrophyOutlined />,
      color: "#b12341",
    },
    {
      title: "จํานวนกรรมการ",
      value: stats.directorCount,
      icon: <UserOutlined />,
      color: "#b12341",
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {statItems.map((stat, index) => (
        <Col xs={24} sm={12} md={6} key={index}>
          <Card
            bordered={false}
            style={{
              backgroundColor: stat.color,
              color: "#fff",
              borderRadius: "8px",
            }}
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
  );
};

export default DashboardStats;
