import React from "react";
import { Button } from "antd"; // นำเข้า Button จาก Ant Design
import moment from "moment";
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

    //เเปลงวันที่ก่อน
    {
      title: "วันเริ่มต้น",
      dataIndex: "startDate",
      render: (date) => {
        console.log("Date value:", date);
        if (date) {
          // ตรวจสอบว่าเป็น Firebase Timestamp หรือไม่
          if (date.toDate) {
            return moment(date.toDate()).format("DD/MM/YYYY");
          }
          // ใช้ moment กับค่าที่เป็น String หรือ Date Object
          const parsedDate = moment(date);
          return parsedDate.isValid() ? parsedDate.format("DD/MM/YYYY") : "-";
        }
        return "-";
      },
    },
    {
      title: "วันสิ้นสุด",
      dataIndex: "endDate",
      render: (date) => {
        if (date) {
          // ตรวจสอบว่าเป็น Firebase Timestamp หรือไม่
          if (date.toDate) {
            return moment(date.toDate()).format("DD/MM/YYYY");
          }
          // ใช้ moment กับค่าที่เป็น String หรือ Date Object
          const parsedDate = moment(date);
          return parsedDate.isValid() ? parsedDate.format("DD/MM/YYYY") : "-";
        }
        return "-";
      },
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
