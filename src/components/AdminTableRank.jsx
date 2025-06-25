import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Typography,
  Input,
} from "antd";
import {
  createScore,
  updateScore,
  deleteScore,
  GetAllScore,
} from "../services/RankingUsers";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const { Title } = Typography;

//components
const TeamDisplay = ({ teamName, leaderName, teamMembers = [] }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <strong>
        ทีม11: {teamName || "ไม่ระบุ"} <br />
        <span style={{ fontSize: "0.85em", color: "#555" }}>
          (หัวหน้าทีม: {leaderName})
        </span>
      </strong>
      <br />
      <Button
        size="small"
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: "2px 8px",
          fontSize: "0.75em",
          marginTop: 4,
          marginBottom: 4,
        }}
      >
        {expanded ? "ซ่อนสมาชิก" : "ดูสมาชิก"}
      </Button>

      {expanded && (
        <ol
          style={{
            paddingLeft: 20,
            fontSize: "0.85em",
            color: "#333",
            marginTop: 4,
            textAlign: "left", // ชิดซ้าย
          }}
        >
          {teamMembers.length > 0 ? (
            teamMembers.map((member, idx) => (
              <li key={idx} style={{ marginBottom: 2 }}>
                {member}
              </li>
            ))
          ) : (
            <li>ไม่มีสมาชิก</li>
          )}
        </ol>
      )}
    </div>
  );
};

const AdminTableRank = () => {
  const [scores, setScores] = useState([]);
  const [users, setUsers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [searchTournament, setSearchTournament] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");

  const [selectedTournament, setSelectedTournament] = useState(null);
  const [eligibleUsers, setEligibleUsers] = useState([]);

  const fetchData = async () => {
    const data = await GetAllScore();
    setScores(data);
  };

  const fetchUsersAndTournaments = async () => {
    const userSnap = await getDocs(collection(db, "users"));
    const allUsers = userSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const filteredUsers = allUsers.filter((user) => user.role === "user");
    setUsers(filteredUsers);

    const tournamentSnap = await getDocs(collection(db, "tournaments"));
    setTournaments(
      tournamentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const fetchRegistrations = async () => {
    const allRegs = [];

    // ดึงรายการ tournament ทั้งหมดก่อน
    const tournamentSnap = await getDocs(collection(db, "tournaments"));
    const tournamentsList = tournamentSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    for (const tour of tournamentsList) {
      const regSnap = await getDocs(
        collection(db, "tournaments", tour.id, "registrations")
      );

      regSnap.forEach((doc) => {
        allRegs.push({
          id: doc.id,
          ...doc.data(),
          tournamentId: tour.id, // เพิ่ม field นี้ให้แน่ใจว่าใช้เทียบได้
        });
      });
    }

    setRegistrations(allRegs);
  };
  useEffect(() => {
    fetchData();
    fetchUsersAndTournaments();
    fetchRegistrations();
  }, []);

  const getTeamType = (userId) => {
    const reg = registrations.find((r) => r.userId === userId);
    return reg?.teamType || "individual";
  };

  const getTeamName = (userId) => {
    const reg = registrations.find((r) => r.userId === userId);
    if (reg?.teamType === "team" && reg?.teamMembers?.length > 0) {
      return `ทีม: ${reg.teamMembers.join(", ")}`;
    }
    return null;
  };

  const filteredScores = useMemo(() => {
    return scores.filter((score) => {
      const user = users.find((u) => u.id === score.userId);
      const tournament = tournaments.find((t) => t.id === score.tournamentId);
      const teamType = getTeamType(score.userId);

      const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`;
      const tournamentName = tournament?.tournamentName || "";

      const userMatch = fullName
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const tournamentMatch = tournamentName
        .toLowerCase()
        .includes(searchTournament.toLowerCase());
      const teamMatch = teamFilter === "all" || teamType === teamFilter;

      return userMatch && tournamentMatch && teamMatch;
    });
  }, [
    scores,
    users,
    tournaments,
    registrations,
    searchText,
    searchTournament,
    teamFilter,
  ]);

  const handleCreateOrUpdate = async (values) => {
    try {
      if (editingId) {
        await updateScore(editingId, values.score);
        message.success("อัปเดตคะแนนแล้ว");
      } else {
        await createScore(
          values.userId,
          values.tournamentId,
          values.score,
          values.round
        );
        message.success("เพิ่มคะแนนแล้ว");

        await fetchRegistrations();

        const filtered = registrations
          .filter((reg) => reg.tournamentId === values.tournamentId)
          .map((reg) => ({
            ...reg,
            user: users.find((u) => u.id === reg.userId),
          }));

        setEligibleUsers(filtered);
      }

      fetchData(); // อัปเดตคะแนน
      form.resetFields();
      setIsModalOpen(false);
      setEditingId(null);
    } catch (err) {
      console.error("Error:", err);
      message.error(err.message || "เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "คุณแน่ใจหรือไม่?",
      content: "การลบจะไม่สามารถย้อนกลับได้",
      okText: "ลบ",
      okType: "danger",
      cancelText: "ยกเลิก",
      onOk: async () => {
        await deleteScore(id);
        message.success("ลบเรียบร้อย");
        fetchData();
      },
    });
  };

  const columns = [
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
            <TeamDisplay
              teamName={reg.teamName}
              leaderName={name}
              teamMembers={reg.teamMembers}
            />
          );
        }

        return name;
      },
    },
    {
      title: "ชื่อกีฬา",
      dataIndex: "tournamentId",
      key: "tournamentId",
      align: "left",
      render: (id) =>
        tournaments.find((t) => t.id === id)?.tournamentName || id,
    },
    {
      title: "คะแนน",
      dataIndex: "score",
      key: "score",
      align: "left",
    },
    {
      title: "รอบ",
      dataIndex: "round",
      key: "round",
      align: "left",
    },
    {
      title: "การจัดการ",
      key: "action",
      align: "left",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              form.setFieldsValue(record);
              setEditingId(record.id);
              setIsModalOpen(true);
            }}
          >
            แก้ไข
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            ลบ
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "auto", padding: "20px" }}>
      <Title level={3} style={{ color: "#b12341" }}>
        จัดการคะแนนผู้ใช้
      </Title>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <Input.Search
          placeholder="ค้นหาชื่อผู้ใช้"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />

        <Input.Search
          placeholder="ค้นหาชื่อกีฬา"
          allowClear
          onChange={(e) => setSearchTournament(e.target.value)}
          style={{ width: 250 }}
        />

        <Select
          defaultValue="all"
          style={{ width: 180 }}
          onChange={(val) => setTeamFilter(val)}
        >
          <Select.Option value="all">แสดงทั้งหมด</Select.Option>
          <Select.Option value="team">เฉพาะทีม</Select.Option>
          <Select.Option value="individual">เฉพาะเดี่ยว</Select.Option>
        </Select>

        <Button danger type="primary" onClick={() => setIsModalOpen(true)}>
          เพิ่มคะแนน
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredScores} rowKey="id" />

      <Modal
        title={editingId ? "แก้ไขคะแนน" : "เพิ่มคะแนน"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingId(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreateOrUpdate} layout="vertical">
          {!editingId && (
            <>
              <Form.Item
                name="tournamentId"
                label="ชื่อกีฬา"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="เลือกกีฬา"
                  onChange={(val) => {
                    form.setFieldsValue({ userId: undefined });
                    setSelectedTournament(val);

                    const filtered = registrations
                      .filter((reg) => reg.tournamentId === val)
                      .map((reg) => ({
                        ...reg,
                        user: users.find((u) => u.id === reg.userId),
                      }));

                    setEligibleUsers(filtered);
                  }}
                >
                  {tournaments.map((t) => (
                    <Select.Option key={t.id} value={t.id}>
                      {t.tournamentName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="userId"
                label="ผู้เข้าแข่งขัน"
                rules={[{ required: true }]}
              >
                <Select placeholder="เลือกผู้เข้าแข่งขัน">
                  {eligibleUsers.map((reg) => {
                    const isTeam = reg.teamType === "team";
                    const label = isTeam
                      ? `ทีม: ${reg.teamName || "ไม่ระบุ"}`
                      : `${reg.user?.firstName} ${reg.user?.lastName}`;

                    return (
                      <Select.Option key={reg.userId} value={reg.userId}>
                        {label}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </>
          )}

          <Form.Item name="score" label="คะแนน" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="round" label="รอบ" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminTableRank;
