import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Typography,
  message,
  Spin,
  Input,
  Row,
  Col,
} from "antd";
import {
  fetchAllRegistrations,
  deleteUserRegistration,
} from "../../services/fetchUserRegistrations";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import HeaderList5 from "../../components/HeaderList5";

const { Title } = Typography;
const { Search } = Input;

const AdminAllRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchName, setSearchName] = useState("");
  const [searchTournament, setSearchTournament] = useState("");

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    setLoading(true);
    try {
      const [allRegistrations, usersSnap] = await Promise.all([
        fetchAllRegistrations(),
        getDocs(collection(db, "users")),
      ]);

      const userMap = {};
      usersSnap.forEach((doc) => {
        const data = doc.data();
        const fullName =
          data.displayName ||
          `${data.firstName || ""} ${data.lastName || ""}`.trim();
        userMap[doc.id] = fullName || "ไม่ทราบชื่อ";
      });

      const registrationsWithName = allRegistrations.map((reg) => ({
        ...reg,
        userName: userMap[reg.userId] || reg.userId,
      }));

      setRegistrations(registrationsWithName);
    } catch (error) {
      console.error("โหลดข้อมูลผิดพลาด:", error);
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (registrationId, tournamentId) => {
    try {
      const confirm = window.confirm("ต้องการยกเลิกการสมัครนี้หรือไม่?");
      if (!confirm) return;
      await deleteUserRegistration(tournamentId, registrationId);
      message.success("ยกเลิกการสมัครเรียบร้อยแล้ว");
      loadRegistrations();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการยกเลิกการสมัคร");
    }
  };

  const filteredRegistrations = registrations.filter(
    (item) =>
      item.userName.toLowerCase().includes(searchName.toLowerCase()) &&
      item.tournamentName.toLowerCase().includes(searchTournament.toLowerCase())
  );

  const columns = [
    {
      title: "ชื่อการแข่งขัน",
      dataIndex: "tournamentName",
      key: "tournamentName",
      align: "left",
    },

    {
      title: "ชื่อผู้สมัคร",
      dataIndex: "userName",
      key: "userName",
      align: "left",
    },

    {
      title: "ประเภท",
      dataIndex: "teamType",
      key: "teamType",
      align: "left",
      render: (type) => (type === "individual" ? "เดี่ยว" : "ทีม"),
    },

    {
      title: "ชื่อทีม",
      dataIndex: "teamName",
      key: "teamName",
      align: "left",
      render: (_, record) =>
        record.teamType === "team"
          ? record.teamName || "ไม่ได้ระบุ"
          : "ประเภทเดี่ยว",
    },

    {
      title: "สมาชิกในทีม",
      key: "teamMembers",
      align: "left",
      render: (_, record) =>
        record.teamType === "team" ? (
          record.teamMembers && record.teamMembers.length > 0 ? (
            <ol
              style={{
                paddingLeft: "0.8em", // ขยับเข้าเล็กน้อยพอให้เลขเห็น
                listStyle: "decimal",
                listStylePosition: "inside", //  ให้ชื่อชิดกับเลข
                margin: 0,
                textAlign: "left", //  จัดให้ชิดซ้าย (ชิดหัว column)
              }}
            >
              {record.teamMembers.map((member, idx) => (
                <li key={idx}>{member}</li>
              ))}
            </ol>
          ) : (
            <span style={{ color: "#aaa" }}>ไม่มีสมาชิกในทีม</span>
          )
        ) : (
          "ประเภทเดี่ยว"
        ),
    },

    {
      title: "การจัดการ",
      key: "action",
      align: "left",
      render: (_, record) => (
        <Button
          danger
          onClick={() =>
            handleCancel(record.registrationId, record.tournamentId)
          }
        >
          ยกเลิกการสมัคร
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "25px", maxWidth: "1200px", margin: "auto" }}>
      <HeaderList5 />
      {/* <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
        รายการผู้สมัครแข่งขัน (Admin)
      </Title> */}

      {/* 🔍 Search Filters */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12}>
          <Search
            placeholder="ค้นหาชื่อผู้สมัคร"
            allowClear
            onChange={(e) => setSearchName(e.target.value)}
          />
        </Col>
        <Col xs={24} sm={12}>
          <Search
            placeholder="ค้นหาชื่อการแข่งขัน"
            allowClear
            onChange={(e) => setSearchTournament(e.target.value)}
          />
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredRegistrations}
          rowKey="registrationId"
          pagination={{ pageSize: 6 }}
          locale={{ emptyText: "ยังไม่มีการสมัครเข้าร่วมการแข่งขัน" }}
        />
      )}
    </div>
  );
};

export default AdminAllRegistrations;
