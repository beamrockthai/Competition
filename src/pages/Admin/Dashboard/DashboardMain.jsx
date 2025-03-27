import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Table, Tag } from "antd";
import {
  UserOutlined,
  TrophyOutlined,
  CalendarOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import moment from "moment";
import "moment/locale/th";
import { PATH_API } from "../../../constrant";
import axios from "axios";

const { Title } = Typography;

export const DashboardMainPage = () => {
  const [teamCount, setTeamCount] = useState(0); // จำนวนผู้เข้าแข่งขัน
  const [directorCount, setDirectorCount] = useState(0); // จำนวนกรรมการ
  const [compType, setCompType] = useState(0); // จำนวนกีฬา

  const [users, setUsers] = useState([]); // รายชื่อผู้ใช้ (เฉพาะ role user)

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

  const todayDate = moment().format("D MMMM YYYY");
  const getUser = async () => {
    const data = await axios.get(PATH_API + `/users/getteampresident/4`);

    setUsers(data.data);
    console.log(data.data);
  };
  const getTeam = async () => {
    const team = await axios.get(PATH_API + `/groups/get`);
    setTeamCount(team.data.length);
    console.log("setTeamCount", team.data.length);
  };
  const getComType = async () => {
    const comtype = await axios.get(PATH_API + `/competition_types/get`);
    setCompType(comtype.data.length);
    console.log("setCompType", comtype.data.length);
  };
  const getDirector = async () => {
    const director = await axios.get(PATH_API + `/users/getbyrole/3`);
    setDirectorCount(director.data.length);
    console.log("setDirectorCount", director.data.length);
  };
  useEffect(() => {
    getUser();
    getTeam();
    getComType();
    getDirector();
    const fetchData = async () => {
      try {
        const userQuerySnapshot = await getDocs(collection(db, "users"));
        const usersData = userQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredUsers = usersData.filter((user) => user.role === "user");
        // setUsers(filteredUsers); // ✅ แสดงเฉพาะ role user ในตาราง
        // setCompetitorCount(filteredUsers.length); // นับจำนวนเฉพาะ role user
        // setDirectorCount(
        //   usersData.filter((user) => user.role === "director").length
        // );

        const tournamentQuerySnapshot = await getDocs(
          collection(db, "tournaments")
        );
        // setTournamentCount(tournamentQuerySnapshot.size); // นับจำนวนกีฬา
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const statistics = [
    {
      title: "วันที่",
      value: todayDate,
      icon: <CalendarOutlined />,
      color: "#00bcd4",
    },
    {
      title: "จํานวนทีมเเข่งขัน",
      value: teamCount,
      icon: <UserOutlined />,
      color: "#1890ff",
    },
    {
      title: "รายการเเข่งขัน",
      value: compType,
      icon: <TrophyOutlined />,
      color: "#52c41a",
    },
    {
      title: "จํานวนกรรมการ",
      value: directorCount,
      icon: <UserOutlined />,
      color: "#faad14",
    },
  ];

  const columns = [
    {
      title: "ผู้เข้าเเข่งขัน",
      dataIndex: "FirstName",
      key: "FirstName",
      render: (text, record) => `${record.FirstName} ${record.LastName}`,
    },
    {
      title: "วันที่สมัครเข้าสู่ระบบ",
      dataIndex: "CreatedAt",
      key: "CreatedAt",
      render: (createdAt) =>
        createdAt ? moment(createdAt).format("DD-MM-YYYY") : "N/A",
    },
    {
      title: "Status",
      key: "Status",
      render: () => <Tag color="blue">User</Tag>,
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

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Card title="รายชื่อผู้เข้าเเข่งขัน" bordered={false}>
            <Table
              dataSource={users}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
