import React, { useEffect, useState } from "react";
import { Table, Card, Row, Col, Select, Typography, Tag, Spin } from "antd";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle } = Typography;
const { Option } = Select;

const PodiumChart = ({ chartData }) => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: "คะแนนรวมของผู้เข้าแข่งขัน",
      },
    },
    responsive: true,
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels: chartData.map((item, index) => {
      const emoji =
        index === 0 ? "🥇 " : index === 1 ? "🥈 " : index === 2 ? "🥉 " : "";
      return `${emoji}${item.name}`;
    }),
    datasets: [
      {
        label: "คะแนนรวม",
        data: chartData.map((item) => item.totalScore),
        backgroundColor: chartData.map((_, index) => {
          if (index === 0) return "#FFD700"; // gold
          if (index === 1) return "#1890ff"; // blue
          if (index === 2) return "#ff4d4f"; // red
          return "#d9d9d9";
        }),
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

const ScoreBarChart = () => {
  const [users, setUsers] = useState([]);
  const [scores, setScores] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredScores = selectedSport
    ? scores.filter((s) => s.tournamentId === selectedSport)
    : scores;

  const getChartData = () => {
    const grouped = {};
    filteredScores.forEach((score) => {
      const user = users.find((u) => u.id === score.userId);
      const fullName = `${user?.firstName || "-"} ${user?.lastName || ""}`;
      if (!grouped[fullName]) grouped[fullName] = 0;
      grouped[fullName] += score.score;
    });

    return Object.entries(grouped)
      .map(([name, totalScore]) => ({ name, totalScore }))
      .sort((a, b) => b.totalScore - a.totalScore);
  };

  const getTableData = () => {
    return filteredScores
      .map((score) => {
        const user = users.find((u) => u.id === score.userId);
        const tournament = tournaments.find((t) => t.id === score.tournamentId);
        return {
          key: score.id,
          fullName: `${user?.firstName || "-"} ${user?.lastName || ""}`,
          tournament: tournament?.tournamentName || score.tournamentId,
          tournamentId: score.tournamentId,
          score: score.score,
          createdAt: user?.createdAt?.toDate().toLocaleDateString("th-TH"),
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
  };

  const columns = [
    {
      title: "อันดับ",
      dataIndex: "rank",
      key: "rank",
      render: (rank) => (
        <Tag
          color={
            rank === 1
              ? "gold"
              : rank === 2
              ? "blue"
              : rank === 3
              ? "red"
              : "default"
          }
        >
          {rank}
        </Tag>
      ),
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
      title: "วันที่สมัคร",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];

  const chartData = getChartData();

  return (
    <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
      <Col span={24}>
        <Card
          title={
            <Row justify="space-between" align="middle">
              <Col>
                <AntTitle level={4} style={{ margin: 0 }}>
                  คะแนนการแข่งขัน
                </AntTitle>
              </Col>
              <Col>
                <Select
                  allowClear
                  placeholder="เลือกกีฬา"
                  style={{ minWidth: 200 }}
                  onChange={(value) => setSelectedSport(value)}
                >
                  {tournaments.map((t) => (
                    <Option key={t.id} value={t.id}>
                      {t.tournamentName}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          }
          bordered={false}
        >
          {loading ? (
            <Spin size="large" />
          ) : (
            <>
              <div style={{ marginBottom: 32 }}>
                <PodiumChart chartData={chartData} />
              </div>
              <Table
                dataSource={getTableData()}
                columns={columns}
                rowKey="key"
                pagination={{ pageSize: 5 }}
                scroll={{ x: true }}
              />
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default ScoreBarChart;
