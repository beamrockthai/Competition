import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  DatePicker,
  Row,
  Col,
  message,
} from "antd";
import moment from "moment";
import {
  fetchTournaments,
  addTournament,
  deleteTournament,
  updateTournament,
} from "./service/tournamentService";

export const Tournaments = () => {
  const [form] = Form.useForm(); // ใช้ form ของ Ant Design
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const tournaments = await fetchTournaments();
    setData(tournaments);
  };

  const handleAddData = async (values) => {
    if (await addTournament(values)) {
      message.success("Tournament added successfully");
      loadData();
      form.resetFields();
    } else {
      message.error("Failed to add tournament");
    }
  };

  const handleDelete = async (id) => {
    if (await deleteTournament(id)) {
      message.success("Tournament deleted successfully");
      loadData();
    } else {
      message.error("Failed to delete tournament");
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate
        ? moment(record.startDate, "YYYY-MM-DD")
        : null,
      endDate: record.endDate ? moment(record.endDate, "YYYY-MM-DD") : null,
    });
  };

  const handleUpdate = async (values) => {
    if (await updateTournament({ ...editingRecord, ...values })) {
      message.success("Tournament updated successfully");
      setIsModalVisible(false);
      loadData();
    } else {
      message.error("Failed to update tournament");
    }
  };

  const columns = [
    {
      title: "Tournament Name",
      dataIndex: "tournamentName",
      key: "tournamentName",
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : ""),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Max Rounds",
      dataIndex: "maxRounds",
      key: "maxRounds",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => handleEdit(record)}
            type="primary"
            size="small"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(record.id)}
            danger
            size="small"
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <Col>
          <h2>เพิ่มข้อมูลทัวร์นาเมนต์</h2>
        </Col>
      </Row>

      <Form
        form={form}
        layout="vertical"
        onFinish={editingRecord ? handleUpdate : handleAddData}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Tournament Name"
              name="tournamentName"
              rules={[
                { required: true, message: "Please enter tournament name" },
              ]}
            >
              <Input placeholder="Tournament Name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <Input placeholder="Description" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: "Please select start date" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: "Please select end date" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Max Rounds"
              name="maxRounds"
              rules={[{ required: true, message: "Please enter max rounds" }]}
            >
              <Input type="number" placeholder="Max Rounds" />
            </Form.Item>
          </Col>
        </Row>
        <Button type="primary" htmlType="submit">
          {editingRecord ? "Update Tournament" : "Add Tournament"}
        </Button>
      </Form>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={{ responsive: true }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Edit Tournament"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          {/* Fields similar to above */}
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form>
      </Modal>
    </div>
  );
};
