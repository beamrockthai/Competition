import React, { useEffect, useState } from "react";
import { Table, Typography, Button, Popconfirm, Spin, message } from "antd";
import { loadUsers, deleteUser } from "../../services/userFunctions";
import HeaderList1 from "../../components/HeaderList1.";

const { Text } = Typography;

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers(setUsers, setLoading);
  }, []);

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <Text strong>{text}</Text>,
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Name",
      dataIndex: "firstName",
      key: "name",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      responsive: ["md", "lg"],
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => deleteUser(record.id, setUsers, setLoading)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <HeaderList1 />

      {loading ? (
        <Spin
          size="large"
          style={{ display: "block", textAlign: "center", marginTop: 50 }}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          bordered
          pagination={{ pageSize: 6 }}
          responsive
        />
      )}
    </div>
  );
};
