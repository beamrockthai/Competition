import React, { useState, useEffect } from "react";
import { Layout, Typography, Spin } from "antd";
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

  if (loading) return <Spin size="large" />;

  return (
    <Layout>
      <Content style={{ padding: "20px" }}>
        <Typography.Title level={2}>สมัครการแข่งขัน</Typography.Title>
        <TournamentList
          tournaments={tournaments}
          onRegister={setSelectedTournament}
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
