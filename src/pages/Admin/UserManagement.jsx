import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Popconfirm,
  message,
  Spin,
} from "antd";
import { loadUsers, deleteUser } from "../../services/userFunctions";

const { Title, Text } = Typography;

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers(setUsers, setLoading);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Title
        level={2}
        style={{
          marginBottom: "20px",
          color: "#1890ff",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Management User
      </Title>

      {loading ? (
        <Spin
          size="large"
          style={{ display: "block", textAlign: "center", marginTop: 50 }}
        />
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {users.map((user) => (
            <Col xs={24} sm={12} md={8} lg={6} key={user.id}>
              <Card
                title={<Text strong>{user.email}</Text>}
                bordered={false}
                style={{
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <p>
                  <strong>Name:</strong> {user.firstName} {user.lastName}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone}
                </p>

                <Popconfirm
                  title="Are you sure to delete this user?"
                  onConfirm={() => deleteUser(user.id, setUsers, setLoading)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" danger>
                    Delete User
                  </Button>
                </Popconfirm>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
