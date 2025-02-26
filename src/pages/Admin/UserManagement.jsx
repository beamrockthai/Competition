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
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Table,
} from "antd";
import {
  loadUsers,
  deleteUser,
  updateUser,
} from "../../services/userFunctions";
import { UserTable } from "../../components/UserTable";
import moment from "moment";

const { Title, Text } = Typography;

export const UserManagement = () => {
  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers(setUsers, setLoading);
  }, []);
  const handleEditUser = (record) => {
    setEditingUser(record);
    formEdit.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleUpdateUser = async () => {
    try {
      const values = await formEdit.validateFields();
      const updatedUsers = {
        ...values,
        startDate: values.startDate ? values.startDate.toDate() : null,
        endDate: values.endDate ? values.endDate.toDate() : null,
        status: values.status, // อัปเดตค่า status
      };
      await updateUser(editingUser.id, updatedUsers);
      message.success("อัปเดตข้อมูลเรียบร้อยแล้ว");
      setEditModalVisible(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
  };
  const handleDelete = async (id) => {
    await deleteUser(id);
    loadUsers();
  };
  const columns = UserTable({ handleEditUser, handleDelete });
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
        <div>
          <Table
            dataSource={users}
            columns={columns}
            rowKey="id"
            loading={loading}
          />
          {/* {users.map((user) => (
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
          ))} */}
        </div>
      )}
      <Modal
        title="แก้ไขผู้ใช้"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleUpdateUser}
        okText="อัปเดต"
        cancelText="ยกเลิก"
      >
        <Form form={formEdit} layout="vertical">
          <Form.Item name="firstName" label="ชื่อ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="นามสกุล"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="เบอร์โทร" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
