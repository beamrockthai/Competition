import React, { useEffect, useState } from "react";
import { Table, Card, Row, Col, Select, Typography, Tag } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const { Title } = Typography;
const { Option } = Select;

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [scores, setScores] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userSnap = await getDocs(collection(db, "users"));
      const scoreSnap = await getDocs(collection(db, "scores"));
      const tournamentSnap = await getDocs(collection(db, "tournaments"));

      const usersData = userSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const scoresData = scoreSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const tournamentData = tournamentSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(usersData);
      setScores(scoresData);
      setTournaments(tournamentData);
    };

    fetchData();
  }, []);

  const getTableData = () => {
    let filteredScores = scores;

    if (selectedSport) {
      filteredScores = filteredScores.filter(
        (s) => s.tournamentId === selectedSport
      );
    }

    if (selectedRound) {
      filteredScores = filteredScores.filter((s) => s.round === selectedRound);
    }

    const merged = filteredScores.map((score) => {
      const user = users.find((u) => u.id === score.userId);
      const tournament = tournaments.find((t) => t.id === score.tournamentId);
      return {
        key: score.id,
        fullName: `${user?.firstName || "-"} ${user?.lastName || ""}`,
        tournament: tournament?.tournamentName || score.tournamentId,
        tournamentId: score.tournamentId,
        score: score.score,
        round: score.round || "-", // ✅ เพิ่มบรรทัดนี้เพื่อให้แสดงรอบ
        createdAt: user?.createdAt?.toDate().toLocaleDateString("th-TH"),
      };
    });

    return merged
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
  };

  const tournamentOptions = tournaments.map((t) => ({
    id: t.id,
    name: t.tournamentName,
  }));

  const roundOptions = [...new Set(scores.map((s) => s.round))].filter(Boolean); // เอาเฉพาะรอบที่ไม่ว่าง

  const columns = [
    {
      title: "อันดับ",
      dataIndex: "rank",
      key: "rank",
      render: (rank) => <Tag color={rank === 1 ? "gold" : "blue"}>{rank}</Tag>,
    },

    {
      title: "ชื่อผู้เข้าแข่งขัน",
      dataIndex: "fullName",
      key: "fullName",
    },

    {
      title: "คะแนน",
      dataIndex: "score",
      key: "score",
    },

    {
      title: "กีฬา",
      dataIndex: "tournament",
      key: "tournament",
    },

    {
      title: "รอบที่",
      dataIndex: "round",
      key: "round",
      render: (round) => `รอบที่ ${round}`,
    },

    {
      title: "วันที่สมัคร",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];

  return (
    <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
      <Col span={24}>
        <Card
          title={
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
              <Col>
                <Title level={4} style={{ margin: 0 }}>
                  คะแนนการแข่งขัน
                </Title>
              </Col>
              <Col>
                <Select
                  allowClear
                  placeholder="เลือกกีฬา"
                  style={{ minWidth: 150, marginRight: 10 }}
                  onChange={(value) => setSelectedSport(value)}
                >
                  {tournamentOptions.map((t) => (
                    <Option key={t.id} value={t.id}>
                      {t.name}
                    </Option>
                  ))}
                </Select>
                <Select
                  allowClear
                  placeholder="เลือกรอบ"
                  style={{ minWidth: 120 }}
                  onChange={(value) => setSelectedRound(value)}
                >
                  {roundOptions.map((round) => (
                    <Option key={round} value={round}>
                      รอบ {round}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          }
          bordered={false}
        >
          <Table
            dataSource={getTableData()}
            columns={columns}
            rowKey="key"
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default UserTable;
