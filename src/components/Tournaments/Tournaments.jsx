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
  const [form, setForm] = useState({
    tournamentName: "",
    description: "",
    startDate: null,
    endDate: null,
    maxRounds: "",
  });
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formEdit] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  // โหลดข้อมูล
  const loadData = async () => {
    const tournaments = await fetchTournaments();
    setData(tournaments);
  };

  // จัดการการเปลี่ยนค่าในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // จัดการการเปลี่ยนวันที่
  const handleDateChange = (date, dateString, name) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: dateString,
    }));
  };

  // เพิ่มข้อมูล
  const handleAddData = async () => {
    if (await addTournament(form)) {
      message.success("Tournament added successfully");
      loadData();
      setForm({
        tournamentName: "",
        description: "",
        startDate: null,
        endDate: null,
        maxRounds: "",
      });
    } else {
      message.error("Failed to add tournament");
    }
  };

  // ลบข้อมูล
  const handleDelete = async (id) => {
    await deleteTournament(id);
    message.success("Tournament deleted successfully");
    loadData();
  };

  // เปิด modal สำหรับแก้ไขข้อมูล
  const handleEdit = (record) => {
    setEditingRecord(record);
    formEdit.setFieldsValue({
      tournamentName: record.tournamentName,
      description: record.description,
      startDate: record.startDate ? moment(record.startDate) : null,
      endDate: record.endDate ? moment(record.endDate) : null,
      maxRounds: record.maxRounds,
    });
    setIsModalVisible(true);
  };

  // อัปเดตข้อมูล
  const handleUpdate = async () => {
    try {
      const values = await formEdit.validateFields();
      const updatedValues = {
        ...values,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
      };
      if (await updateTournament(editingRecord.id, updatedValues)) {
        message.success("Tournament updated successfully");
        setIsModalVisible(false);
        setEditingRecord(null);
        loadData();
      } else {
        message.error("Failed to update tournament");
      }
    } catch (error) {
      message.error("Please complete the form correctly");
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
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : ""),
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : ""),
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "Max Rounds",
      dataIndex: "maxRounds",
      key: "maxRounds",
      responsive: ["sm", "md", "lg", "xl"],
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
      <h2>เพิ่มข้อมูลทัวร์นาเมนต์</h2>
      <Form layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Tournament Name" required>
              <Input
                name="tournamentName"
                placeholder="Tournament Name"
                value={form.tournamentName}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Description" required>
              <Input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Start Date" required>
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                value={
                  form.startDate ? moment(form.startDate, "YYYY-MM-DD") : null
                }
                onChange={(date, dateString) =>
                  handleDateChange(date, dateString, "startDate")
                }
                placeholder="Start Date"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="End Date" required>
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                value={form.endDate ? moment(form.endDate, "YYYY-MM-DD") : null}
                onChange={(date, dateString) =>
                  handleDateChange(date, dateString, "endDate")
                }
                placeholder="End Date"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Max Rounds" required>
              <Input
                type="number"
                name="maxRounds"
                placeholder="Max Rounds"
                value={form.maxRounds}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={8}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Button type="primary" onClick={handleAddData} block>
              เพิ่มการแข่งขัน
            </Button>
          </Col>
        </Row>
      </Form>
      <hr />
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={{ responsive: true }}
        scroll={{ x: "max-content" }}
      />

      {/* Edit Modal */}
      <Modal
        title="แก้ไขข้อมูลทัวร์นาเมนต์"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={handleCancel}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <Form form={formEdit} layout="vertical">
          <Form.Item
            name="tournamentName"
            label="Tournament Name"
            rules={[{ required: true, message: "กรุณากรอกชื่อทัวร์นาเมนต์" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "กรุณากรอกรายละเอียด" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "กรุณาเลือกวันที่เริ่มต้น" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "กรุณาเลือกวันที่สิ้นสุด" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="maxRounds"
            label="Max Rounds"
            rules={[{ required: true, message: "กรุณากรอกจำนวนรอบสูงสุด" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
