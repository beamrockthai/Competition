import React from "react";
import { Button, message, Popconfirm, Space } from "antd";
import TableComponent from "../../components/TableComponent";

const EvaluationTable = ({ forms, loading, onEdit, onDelete, onAssign }) => {
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };
  const columns = [
    {
      title: "ชื่อแบบฟอร์ม",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "ประเภทแข่งที่ใช้",
      dataIndex: "CompetitionTypeId",
      key: "CompetitionTypeId",
      render: (_, record) => (
        <>
          {record.competition_type &&
          record.competition_type.CompetitionTypeName
            ? record.competition_type.CompetitionTypeName
            : "ไม่พบ"}
        </>
      ),
    },
    {
      title: "รอบที่ใช้",
      dataIndex: "CompetitionRoundId",
      key: "CompetitionRoundId",
      render: (_, record) => (
        <>
          {record.competition_round && record.competition_round.Details
            ? record.competition_round.Details
            : "ไม่พบ"}
        </>
      ),
    },
    {
      title: "การจัดการ",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => onEdit(record)}>
            แก้ไข
          </Button>
          <Popconfirm
            title={`คุณต้องการลบการแข่งขันประเภท ${record.CompetitionTypeName} ?`}
            description={`โปรดแน่ใจว่าไม่มีทีมใดเลือกประเภทนี้อยู่`}
            onConfirm={() => onDelete(record.id)}
            onCancel={cancel}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
          >
            <Button danger style={{ marginLeft: 8 }}>
              ลบ
            </Button>
          </Popconfirm>
          <Button type="default" onClick={() => onAssign(record)}>
            กำหนดใช้งาน
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <TableComponent
        dataSource={(forms || []).map((form) => ({ ...form, key: form.id }))}
        columns={columns}
        loading={loading}
      />
    </>
  );
};

export default EvaluationTable;
