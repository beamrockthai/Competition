import React from "react";
import { Button, Tag } from "antd"; // นำเข้า Button จาก Ant Design
import moment from "moment";

export const UserTable = ({ handleEditUser, handleDelete }) => {
  const columns = [
    {
      title: "ชื่อ",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "เบอร์โทร",
      dataIndex: "phone",
      key: "phone",
    },

    //เเปลงวันที่ก่อน

    // {
    //   title: "สถานะ",
    //   dataIndex: "status",
    //   width: 120,
    //   render: (status) => (
    //     <Tag color={status ? "green" : "red"}>
    //       {status ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
    //     </Tag>
    //   ),
    // },

    {
      title: "การจัดการ",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => handleEditUser(record)}>
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
