import React, { useState } from "react";
import { Card, Button, Row, Col, Badge, Typography } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import TournamentRegister from "./TournamentRegister";
import { useUserAuth } from "../Context/UserAuth";

const TournamentList = ({ tournaments }) => {
  const { user } = useUserAuth();
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenRegister = (tournament) => {
    setSelectedTournament(tournament);
    setModalVisible(true);
  };

  return (
    <div style={{ padding: "30px", maxWidth: "100%", overflowX: "hidden" }}>
      <Row gutter={[24, 24]}>
        {tournaments.map((tournament) => (
          <Col key={tournament.id} xs={24} sm={12} md={8} lg={6}>
            <Badge.Ribbon
              text={tournament.status ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
              color={tournament.status ? "green" : "red"}
            >
              <Card
                hoverable
                bordered
                style={{
                  width: "100%",
                  minHeight: "280px",
                  borderRadius: "12px",
                }}
              >
                <Typography.Title level={5} style={{ color: "#b12341" }}>
                  {tournament.tournamentName}
                </Typography.Title>

                <Typography.Paragraph
                  type="secondary"
                  style={{ minHeight: 60 }}
                >
                  {tournament.description}
                </Typography.Paragraph>

                <div style={{ marginBottom: 16 }}>
                  {tournament.status ? (
                    <CheckCircleTwoTone twoToneColor="#52c41a" /> // icon สีเขียว
                  ) : (
                    <CloseCircleTwoTone twoToneColor="#f5222d" /> // icon สีแดง
                  )}{" "}
                  <span style={{ marginLeft: 6 }}>
                    {tournament.status ? "เปิดรับสมัครอยู่" : "ปิดรับสมัครแล้ว"}
                  </span>
                </div>

                <Button
                  danger
                  type="primary"
                  block
                  disabled={!tournament.status}
                  onClick={() => handleOpenRegister(tournament)}
                >
                  สมัครแข่งขัน
                </Button>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>

      {/* Modal สมัคร */}
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
