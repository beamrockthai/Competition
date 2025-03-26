import React from "react";
import { Button, message, Popconfirm, Tag } from "antd"; // นำเข้า Button จาก Ant Design
import moment from "moment";

const TournamentTable = ({ handleEditTournament, handleDelete }) => {
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };
  const columns = [
    {
      title: "ชื่อการแข่งขัน",
      dataIndex: "CompetitionTypeName",
    },
    {
      title: "คำอธิบาย",
      dataIndex: "Details",
    },

    //เเปลงวันที่ก่อน
    // {
    //   title: "วันเริ่มต้น",
    //   dataIndex: "startDate",
    //   render: (date) => {
    //     console.log("Date value:", date);
    //     if (date) {
    //       // ตรวจสอบว่าเป็น Firebase Timestamp หรือไม่
    //       if (date.toDate) {
    //         return moment(date.toDate()).format("DD/MM/YYYY");
    //       }
    //       // ใช้ moment กับค่าที่เป็น String หรือ Date Object
    //       const parsedDate = moment(date);
    //       return parsedDate.isValid() ? parsedDate.format("DD/MM/YYYY") : "-";
    //     }
    //     return "-";
    //   },
    // },
    // {
    //   title: "วันสิ้นสุด",
    //   dataIndex: "endDate",
    //   render: (date) => {
    //     if (date) {
    //       // ตรวจสอบว่าเป็น Firebase Timestamp หรือไม่
    //       if (date.toDate) {
    //         return moment(date.toDate()).format("DD/MM/YYYY");
    //       }
    //       // ใช้ moment กับค่าที่เป็น String หรือ Date Object
    //       const parsedDate = moment(date);
    //       return parsedDate.isValid() ? parsedDate.format("DD/MM/YYYY") : "-";
    //     }
    //     return "-";
    //   },
    // },
    // {
    //   title: "จำนวนรอบสูงสุด",
    //   dataIndex: "maxRounds",
    // },

    // {
    //   title: "จำนวนผู้สมัคร",
    //   dataIndex: "registrationCount",
    // },

    {
      title: "สถานะ",
      dataIndex: "IsOpened",
      width: 120,
      render: (IsOpened) => (
        <Tag
          color={
            IsOpened === "Yes" ? "green" : IsOpened === "No" ? "red" : null
          }
        >
          {IsOpened === "Yes"
            ? "เปิดรับสมัคร"
            : IsOpened === "No"
            ? "ปิดรับสมัคร"
            : null}
        </Tag>
      ),
    },

    {
      title: "การจัดการ",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => handleEditTournament(record)}>
            แก้ไข
          </Button>
          <Popconfirm
            title={`คุณต้องการลบการแข่งขันประเภท ${record.CompetitionTypeName} ?`}
            description={`โปรดแน่ใจว่าไม่มีทีมใดเลือกประเภทนี้อยู่`}
            onConfirm={() => handleDelete(record.id)}
            onCancel={cancel}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
          >
            <Button danger style={{ marginLeft: 8 }}>
              ลบ
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return columns;
};

export default TournamentTable;
