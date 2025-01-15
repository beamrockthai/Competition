import React, { useState } from "react";
import { Card, Button, Row, Col } from "antd";
import TournamentRegister from "./TournamentRegister";
import { useUserAuth } from "../Context/UserAuth"; // ✅ ดึงข้อมูล User

const TournamentList = ({ tournaments }) => {
  const { user } = useUserAuth(); // ✅ ดึงข้อมูล User ID
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenRegister = (tournament) => {
    setSelectedTournament(tournament);
    setModalVisible(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {tournaments.map((tournament) => (
          <Col key={tournament.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              title={tournament.tournamentName}
              bordered={false}
              style={{ width: "100%" }}
            >
              <p>{tournament.description}</p>
              <Button
                type="primary"
                block
                onClick={() => handleOpenRegister(tournament)}
              >
                สมัครแข่งขัน
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ✅ ตรวจสอบว่ามี `user` หรือไม่ */}
      {selectedTournament && user && (
        <TournamentRegister
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          tournament={selectedTournament}
          userId={user.uid} // ✅ ส่งค่า User ID ไป
        />
      )}
    </div>
  );
};

export default TournamentList;
