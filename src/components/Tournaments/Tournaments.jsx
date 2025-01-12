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
  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  // โหลดข้อมูลทัวร์นาเมนต์
  const loadData = async () => {
    try {
      const tournaments = await fetchTournaments();
      setData(tournaments);
    } catch (error) {
      message.error("Failed to load tournaments");
    }
  };

  // เพิ่มทัวร์นาเมนต์ใหม่
  const handleAddData = async (values) => {
    try {
      const newTournament = {
        ...values,
        startDate: values.startDate ? values.startDate.toDate() : null,
        endDate: values.endDate ? values.endDate.toDate() : null,
      };
      await addTournament(newTournament);
      message.success("Tournament added successfully");
      form.resetFields();
      loadData();
    } catch (error) {
      message.error("Failed to add tournament");
    }
  };

  // ลบข้อมูล
  const handleDelete = async (id) => {
    try {
      await deleteTournament(id);
      message.success("Tournament deleted successfully");
      loadData();
    } catch (error) {
      message.error("Failed to delete tournament");
    }
  };

  // เปิด Modal เพื่อแก้ไขข้อมูล
  const handleEdit = (record) => {
    setEditingRecord(record);
    formEdit.setFieldsValue({
      tournamentName: record.tournamentName,
      description: record.description,
      maxRounds: record.maxRounds,
      startDate: record.startDate ? moment(record.startDate) : null,
      endDate: record.endDate ? moment(record.endDate) : null,
    });
    setIsModalVisible(true);
  };

  // อัปเดตข้อมูลทัวร์นาเมนต์
  const handleUpdate = async () => {
    try {
      const values = await formEdit.validateFields();
      const updatedValues = {
        ...values,
        startDate: values.startDate ? values.startDate.toDate() : null,
        endDate: values.endDate ? values.endDate.toDate() : null,
      };
      await updateTournament(editingRecord.id, updatedValues);
      message.success("Tournament updated successfully");
      setIsModalVisible(false);
      setEditingRecord(null);
      loadData();
    } catch (error) {
      message.error("Failed to update tournament");
    }
  };

  // ยกเลิกการแก้ไข
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  // คอลัมน์ของตาราง
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
    { title: "Max Rounds", dataIndex: "maxRounds", key: "maxRounds" },
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
          <h2>Add Tournament</h2>
        </Col>
        <Col>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => form.submit()}
          >
            Add Tournament
          </Button>
        </Col>
      </Row>

      <Form form={form} layout="vertical" onFinish={handleAddData}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Tournament Name"
              name="tournamentName"
              rules={[{ required: true }]}
            >
              <Input placeholder="Tournament Name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true }]}
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
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true }]}
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
              rules={[{ required: true }]}
            >
              <Input type="number" placeholder="Max Rounds" />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={{ responsive: true }}
        scroll={{ x: "max-content" }}
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Tournament"
        open={isModalVisible}
        onOk={handleUpdate}
        onCancel={handleCancel}
      >
        <Form form={formEdit} layout="vertical">
          <Form.Item
            label="Tournament Name"
            name="tournamentName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Max Rounds"
            name="maxRounds"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
