import React, { useState } from "react";
import { Button, Space, Select } from "antd";
import TableComponent from "../../components/TableComponent";

const { Option } = Select;

const EvaluationTable = ({ forms, loading, onEdit, onDelete, onAssign }) => {
  const [filter, setFilter] = useState("all");

  const filteredForms = (forms || []).filter((form) => {
    const isAssigned =
      (form.assignedTo && form.assignedTo.length > 0) || form.participantId;

    if (filter === "assigned") return isAssigned;
    if (filter === "unassigned") return !isAssigned;
    return true; // "all"
  });

  const columns = [
    {
      title: "ชื่อแบบฟอร์ม",
      dataIndex: "name",
      key: "name",
      align: "left",
    },
    {
      title: "การจัดการ",
      key: "action",
      render: (_, record) => {
        const isAssigned =
          (record.assignedTo && record.assignedTo.length > 0) ||
          record.participantId;

        return (
          <Space>
            <Button type="primary" onClick={() => onEdit(record)}>
              แก้ไข
            </Button>
            <Button danger onClick={() => onDelete(record.id)}>
              ลบ
            </Button>
            {isAssigned ? (
              <Button type="default" disabled>
                มอบหมายแล้ว
              </Button>
            ) : (
              <Button type="default" onClick={() => onAssign(record)}>
                มอบหมาย
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <Select
          defaultValue="all"
          value={filter}
          onChange={setFilter}
          style={{ width: 200, minWidth: 150 }}
        >
          <Option value="all">ทั้งหมด</Option>
          <Option value="unassigned">ยังไม่มอบหมาย</Option>
          <Option value="assigned">มอบหมายแล้ว</Option>
        </Select>
      </div>

      <TableComponent
        dataSource={filteredForms.map((form) => ({
          ...form,
          key: form.id,
        }))}
        columns={columns}
        loading={loading}
      />
    </div>
  );
};

export default EvaluationTable;
