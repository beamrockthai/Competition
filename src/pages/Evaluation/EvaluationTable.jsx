import React from "react";
import { Button, Space } from "antd";
import TableComponent from "../../components/TableComponent";

const EvaluationTable = ({ forms, loading, onEdit, onDelete, onAssign }) => {
  const columns = [
    {
      title: "ชื่อแบบฟอร์ม",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "การจัดการ",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => onEdit(record)}>
            แก้ไข
          </Button>
          <Button danger onClick={() => onDelete(record.id)}>
            ลบ
          </Button>
          <Button type="default" onClick={() => onAssign(record)}>
            มอบหมาย
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
