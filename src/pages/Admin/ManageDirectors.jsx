import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  message,
  Popconfirm,
  Row,
  Col,
  Card,
} from "antd";
import { useUserAuth } from "../../Context/UserAuth";
import {
  loadDirectors,
  addDirector,
  deleteDirector,
} from "./../../services/directorFunctions";

export const ManageDirectors = () => {
  const { signUpDirector } = useUserAuth();
  const [loading] = useState(false);
  const [directors, setDirectors] = useState([]);
  const [passwords, setPasswords] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    loadDirectors(setDirectors);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Manage Directors
      </h2>

      {/* ✅ Responsive Form */}
      <Row justify="center">
        <Col xs={24} sm={18} md={14} lg={10}>
          <Card>
            <Form
              layout="vertical"
              onFinish={(values) =>
                addDirector(
                  values,
                  signUpDirector,
                  setPasswords,
                  setDirectors,
                  form
                )
              }
              form={form}
            >
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  { required: true, message: "Please enter first name!" },
                ]}
              >
                <Input placeholder="Enter First Name" />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Please enter last name!" }]}
              >
                <Input placeholder="Enter Last Name" />
              </Form.Item>

              <Form.Item
                name="idCard"
                label="ID Card Number"
                rules={[
                  { required: true, message: "Please enter ID card number!" },
                  { len: 13, message: "ID card number must be 13 digits!" },
                ]}
              >
                <Input placeholder="Enter ID Card Number" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Please enter address!" }]}
              >
                <Input.TextArea placeholder="Enter Address" rows={2} />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter a valid email!",
                  },
                ]}
              >
                <Input placeholder="Enter Director Email" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter a password!" },
                ]}
              >
                <Input.Password placeholder="Enter Password" />
              </Form.Item>

              <Button type="primary" htmlType="submit" block loading={loading}>
                Create Director
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* ✅ Responsive Table */}
      <Table
        dataSource={directors}
        columns={[
          {
            title: "First Name",
            dataIndex: "firstName",
            responsive: ["xs", "sm", "md", "lg"],
          },
          {
            title: "Last Name",
            dataIndex: "lastName",
            responsive: ["xs", "sm", "md", "lg"],
          },
          {
            title: "ID Card",
            dataIndex: "idCard",
            responsive: ["sm", "md", "lg"],
          },
          {
            title: "Address",
            dataIndex: "address",
            responsive: ["md", "lg"],
          },
          {
            title: "Email",
            dataIndex: "email",
            responsive: ["xs", "sm", "md", "lg"],
          },
          {
            title: "Role",
            dataIndex: "role",
            responsive: ["sm", "md", "lg"],
          },
          {
            title: "Password",
            dataIndex: "email",
            render: (email) => passwords[email] || "N/A",
            responsive: ["md", "lg"],
          },
          {
            title: "Actions",
            dataIndex: "id",
            render: (id) => (
              <Popconfirm
                title="Are you sure to delete this director?"
                onConfirm={() => deleteDirector(id, setDirectors)}
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            ),
          },
        ]}
        rowKey="id"
        style={{ marginTop: "20px" }}
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }} // ✅ ป้องกัน Table ล้นหน้าจอ
      />
    </div>
  );
};
