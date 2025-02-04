// แสดงกีฬารูปแบบ Card
import React from "react";
import { Card, Button } from "antd";

const TournamentCard = ({ tournament, onRegister }) => {
  return (
    <Card
      hoverable
      style={{ width: "100%", maxWidth: 320, margin: "auto" }}
      cover={<img alt={tournament.tournamentName} src={tournament.imageUrl} />}
    >
      <Card.Meta
        title={tournament.tournamentName}
        description={tournament.description}
      />
      <Button
        danger
        type="primary"
        style={{ marginTop: 10, width: "100%" }}
        onClick={() => onRegister(tournament)}
      >
        สมัครแข่งขัน
      </Button>
    </Card>
  );
};

export default TournamentCard;
