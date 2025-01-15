// รายการกีฬาที่ User สามารถสมัคร
import React, { useState, useEffect } from "react";
import { Row, Col, Spin, message } from "antd";
import TournamentCard from "./TournamentCard";
import { fetchTournaments } from "../services/tournamentService";

const TournamentList = ({ onRegister }) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const data = await fetchTournaments();
      setTournaments(data);
    } catch (error) {
      message.error("Failed to load tournaments");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;

  return (
    <Row gutter={[16, 16]} justify="center">
      {tournaments.map((tournament) => (
        <Col key={tournament.id} xs={24} sm={12} md={8} lg={6}>
          <TournamentCard tournament={tournament} onRegister={onRegister} />
        </Col>
      ))}
    </Row>
  );
};

export default TournamentList;
