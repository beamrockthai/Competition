import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Modal,
  message,
  Popconfirm,
} from "antd"; // เพิ่ม Popconfirm ที่นี่
import { useUserAuth } from "../../Context/UserAuth";
import {
  loadDirectors,
  addDirector,
  deleteDirector,
} from "../../services/directorFunctions";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/TableComponent"; // นำเข้า TableComponent

export const ManageDirectors = () => {
  const { signUpDirector } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [directors, setDirectors] = useState([]);
  const [passwords, setPasswords] = useState({});
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadDirectors(setDirectors);
  }, []);

  const handleAddDirector = async (values) => {
    setLoading(true);
    try {
      await addDirector(
        values,
        signUpDirector,
        setPasswords,
        setDirectors,
        form
      );
      message.success("กรรมการถูกเพิ่มเรียบร้อยแล้ว");
      setIsModalOpen(false);
      form.resetFields();
      navigate("/manage-directors");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเพิ่มกรรมการ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header Section */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <Col>
          <h2 style={{ margin: 0 }}>จัดการกรรมการ</h2>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: "#b12341", borderColor: "#b12341" }}
          >
            เพิ่มกรรมการ
          </Button>
        </Col>
      </Row>

      {/* เรียกใช้ table componet ตรงนี้นะ */}
      <TableComponent
        columns={[
          { title: "First Name", dataIndex: "firstName" },
          { title: "Last Name", dataIndex: "lastName" },
          { title: "ID Card", dataIndex: "idCard" },
          { title: "Address", dataIndex: "address" },
          { title: "Email", dataIndex: "email" },
          { title: "Role", dataIndex: "role" },
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
                title="คุณแน่ใจหรือไม่ว่าต้องการลบ ?"
                onConfirm={() => deleteDirector(id, setDirectors)}
              >
                <Button danger>ลบ</Button>
              </Popconfirm>
            ),
          },
        ]}
        dataSource={directors}
        bordered={true}
        loading={loading}
        pagination={{ pageSize: 5 }}
        rowKey="id" // เพิ่ม rowKey ที่ใช้ค่า id เป็น key
        onRowClick={(record) => console.log(record)} // Example of row click handling
      />

      {/* Modal for Adding Director */}
      <Modal
        title="เพิ่มกรรมการ"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddDirector} form={form}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name!" }]}
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
            rules={[{ required: true, message: "Please enter a password!" }]}
          >
            <Input.Password placeholder="Enter Password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            เพิ่มกรรมการ
          </Button>
        </Form>
      </Modal>
    </div>
  );
};
