import React from "react";
import { Table, Popconfirm, Button } from "antd";

const DirectorsTable = ({ directors, passwords, deleteDirector }) => {
  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "ID Card",
      dataIndex: "idCard",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Password",
      dataIndex: "email",
      render: (email) => passwords[email] || "N/A",
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (id) => (
        <Popconfirm
          title="Are you sure to delete this director?"
          onConfirm={() => deleteDirector(id)}
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      dataSource={directors}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 5 }}
      scroll={{ x: "max-content" }}
    />
  );
};

export default DirectorsTable;
