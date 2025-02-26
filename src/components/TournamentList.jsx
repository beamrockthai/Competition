import React, { useState } from "react";
import { Card, Button, Row, Col } from "antd";
import TournamentRegister from "./TournamentRegister";
import { useUserAuth } from "../Context/UserAuth"; // ดึงข้อมูล User

const TournamentList = ({ tournaments }) => {
  const { user } = useUserAuth(); // ดึงข้อมูล User ID
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenRegister = (tournament) => {
    setSelectedTournament(tournament);
    setModalVisible(true);
  };

  return (
    // container ห่อหุ้มด้วย maxWidth และ overflowX เพื่อรองรับหน้าจอที่เล็กลง
    <div style={{ padding: "20px", maxWidth: "100%", overflowX: "auto" }}>
      <Row gutter={[16, 16]}>
        {tournaments?.map((tournament) => (
          <Col key={tournament.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              title={tournament.CompetitionTypeName}
              bordered={false}
              style={{ width: "100%", marginBottom: "20px" }}
            >
              {/* คำอธิบายการแข่งขัน */}
              <p>{tournament.Details}</p>

              {/* แสดงสถานะด้านล่างเนื้อหาการ์ด (ไม่ปิดชื่อ) */}
              <Button
                disabled
                style={{
                  backgroundColor: tournament.status ? "#52c41a" : "#f5222d",
                  color: "#fff",
                  border: "none",
                  cursor: "default",
                  width: "100%",
                  marginBottom: "10px",
                }}
              >
                {tournament.status ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
              </Button>

              {/* ปุ่มสมัครแข่งขัน */}
              <Button
                type="primary"
                block
                onClick={() => handleOpenRegister(tournament)}
                disabled={!tournament.status}
              >
                สมัครแข่งขัน
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ตรวจสอบว่ามี user และ tournament ที่เลือกไว้หรือไม่ */}
      {selectedTournament && user && (
        <TournamentRegister
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          tournament={selectedTournament}
          userId={user.uid}
        />
      )}
    </div>
  );
};

export default TournamentList;
