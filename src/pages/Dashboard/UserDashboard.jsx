import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Spin,
  Row,
  Col,
  Card,
  Divider,
  Button,
} from "antd";
import TournamentList from "../../components/TournamentList";
import TournamentRegister from "../../components/TournamentRegister";
import { fetchTournaments } from "../../services/tournamentService";

const { Content } = Layout;

const UserDashboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    const data = await fetchTournaments();
    setTournaments(data);
    setLoading(false);
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin size="large" />
      </div>
    );

  return (
    <Layout
      style={{ background: "#f0f2f5", minHeight: "100vh", padding: "20px" }}
    >
      <Content style={{ maxWidth: "1200px", margin: "auto" }}>
        <Typography.Title
          level={2}
          style={{ textAlign: "center", color: "#2C3E50" }}
        >
          🏆 สมัครการแข่งขัน
        </Typography.Title>

        <Divider />

        <TournamentList
          tournaments={tournaments}
          onRegister={setSelectedTournament} // ✅ ใช้การสมัครแบบเดิม ไม่เปลี่ยนแปลงการทำงาน
        />

        {selectedTournament && (
          <TournamentRegister
            tournament={selectedTournament}
            onClose={() => setSelectedTournament(null)}
          />
        )}
      </Content>
    </Layout>
  );
};

export default UserDashboard;
