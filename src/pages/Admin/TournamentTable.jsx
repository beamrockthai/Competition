import React from "react";
import { Button } from "antd"; // นำเข้า Button จาก Ant Design

const TournamentTable = ({ handleEditTournament, handleDelete }) => {
  const columns = [
    {
      title: "ชื่อการแข่งขัน",
      dataIndex: "tournamentName",
    },
    {
      title: "คำอธิบาย",
      dataIndex: "description",
    },
    {
      title: "วันเริ่มต้น",
      dataIndex: "startDate",
      render: (date) => (date ? date : "-"),
    },
    {
      title: "วันสิ้นสุด",
      dataIndex: "endDate",
      render: (date) => (date ? date : "-"),
    },
    {
      title: "จำนวนรอบสูงสุด",
      dataIndex: "maxRounds",
    },
    {
      title: "จำนวนผู้สมัคร",
      dataIndex: "registrationCount",
    },
    {
      title: "การจัดการ",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => handleEditTournament(record)}>
            แก้ไข
          </Button>
          <Button
            danger
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 8 }}
          >
            ลบ
          </Button>
        </>
      ),
    },
  ];

  return columns;
};

export default TournamentTable;
