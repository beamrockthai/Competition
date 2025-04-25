import React, { useEffect, useState } from "react";
import { Table, Card, Row, Col, Select, Typography, Tag, Input } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const { Title } = Typography;
const { Option } = Select;

// สมาชิกทีม toggle
const TeamMemberToggle = ({ members = [] }) => {
  const [expanded, setExpanded] = useState(false);
  if (!members || members.length === 0) return "-";

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          fontSize: "1em",
          color: "#1677ff",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        {expanded ? "ซ่อนสมาชิก" : "ดูสมาชิก"}
      </button>
      {expanded && (
        <ol
          style={{
            margin: "8px 0 0 0",
            paddingLeft: 20,
            fontSize: "0.95em",
            color: "#000",
            textAlign: "left",
          }}
        >
          {members.map((member, idx) => (
            <li key={idx} style={{ marginBottom: 4 }}>
              {member}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [scores, setScores] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [teamFilter, setTeamFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      const userSnap = await getDocs(collection(db, "users"));
      const scoreSnap = await getDocs(collection(db, "scores"));
      const tournamentSnap = await getDocs(collection(db, "tournaments"));

      const tournamentDocs = tournamentSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const allRegistrations = [];

      for (const tour of tournamentDocs) {
        const regSnap = await getDocs(
          collection(db, "tournaments", tour.id, "registrations")
        );

        regSnap.forEach((doc) => {
          allRegistrations.push({
            id: doc.id,
            ...doc.data(),
            tournamentId: tour.id, // เพิ่มไว้ใช้เปรียบเทียบ
          });
        });
      }

      setUsers(userSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setScores(scoreSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setTournaments(tournamentDocs);
      setRegistrations(allRegistrations); //  ใช้ registrations ที่รวมจากทุก tournament
    };

    fetchData();
  }, []);

  const getTeamType = (userId) => {
    const reg = registrations.find((r) => r.userId === userId);
    return reg?.teamType || "individual";
  };

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

    if (teamFilter !== "all") {
      filteredScores = filteredScores.filter(
        (s) => getTeamType(s.userId) === teamFilter
      );
    }

    return filteredScores
      .map((score) => {
        const user = users.find((u) => u.id === score.userId);
        const tournament = tournaments.find((t) => t.id === score.tournamentId);
        return {
          key: score.id,
          userId: score.userId,
          fullName: `${user?.firstName || "-"} ${user?.lastName || ""}`,
          tournament: tournament?.tournamentName || score.tournamentId,
          tournamentId: score.tournamentId,
          score: score.score,
          round: score.round || "-",
          createdAt: user?.createdAt?.toDate().toLocaleDateString("th-TH"),
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
  };

  const getBarChartData = () => {
    const data = getTableData();

    return data.map((item, index) => ({
      name: item.fullName,
      score: item.score,
      fill:
        index === 0
          ? "#FFD700"
          : index === 1
          ? "#cd7f32"
          : index === 2
          ? "#C0C0C0"
          : "#888888",
    }));
  };

  const columns = [
    {
      title: "อันดับ",
      dataIndex: "rank",
      key: "rank",
      render: (rank) => {
        let color = "#888";
        if (rank === 1) color = "#FFD700";
        else if (rank === 2) color = "#cd7f32";
        else if (rank === 3) color = "#C0C0C0";
        return <Tag color={color}>{rank}</Tag>;
      },
    },
    {
      title: "ชื่อผู้เข้าแข่งขัน",
      dataIndex: "userId",
      key: "userId",
      align: "left",
      render: (id) => {
        const user = users.find((u) => u.id === id);
        const name = user ? `${user.firstName} ${user.lastName}` : id;
        const reg = registrations.find((r) => r.userId === id);

        if (reg?.teamType === "team") {
          return (
            <div>
              <strong>{reg.teamName || "ไม่ระบุ"}</strong>
              <br />
              <span style={{ fontSize: "0.85em", color: "#555" }}>
                (หัวหน้าทีม: {name})
              </span>
            </div>
          );
        }

        return name;
      },
    },
    {
      title: "ชื่อทีม",
      dataIndex: "userId",
      key: "teamName",
      align: "left",
      render: (id) => {
        const reg = registrations.find((r) => r.userId === id);
        return reg?.teamType === "team" ? reg.teamName || "-" : "ประเภทเดี่ยว";
      },
    },
    {
      title: "สมาชิกในทีม",
      dataIndex: "userId",
      key: "teamMembers",
      align: "left",
      render: (id) => {
        const reg = registrations.find((r) => r.userId === id);
        return reg?.teamType === "team" ? (
          <TeamMemberToggle members={reg.teamMembers || []} />
        ) : (
          "เเข่งเดี่ยว"
        );
      },
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
              <Col style={{ display: "flex", gap: 10 }}>
                <Select
                  allowClear
                  placeholder="เลือกประเภททีม"
                  style={{ minWidth: 150 }}
                  onChange={(val) => setTeamFilter(val)}
                  defaultValue="all"
                >
                  <Option value="all">ทั้งหมด</Option>
                  <Option value="individual">เดี่ยว</Option>
                  <Option value="team">ทีม</Option>
                </Select>
                <Select
                  allowClear
                  placeholder="เลือกกีฬา"
                  style={{ minWidth: 150 }}
                  onChange={(val) => setSelectedSport(val)}
                >
                  {tournaments.map((t) => (
                    <Option key={t.id} value={t.id}>
                      {t.tournamentName}
                    </Option>
                  ))}
                </Select>
                <Select
                  allowClear
                  placeholder="เลือกรอบ"
                  style={{ minWidth: 120 }}
                  onChange={(val) => setSelectedRound(val)}
                >
                  {[...new Set(scores.map((s) => s.round))]
                    .filter((r) => r != null)
                    .sort((a, b) => a - b)
                    .map((round) => (
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

          {selectedRound && (
            <div style={{ marginTop: 40 }}>
              <Title level={5}>กราฟลําดับรอบ {selectedRound}</Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={getBarChartData()}
                  layout="horizontal"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" type="category" />
                  <YAxis type="number" />
                  <Tooltip />
                  <Bar
                    dataKey="score"
                    isAnimationActive={true}
                    label={{ position: "top", fill: "#b12341" }}
                  >
                    {getBarChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default UserTable;
