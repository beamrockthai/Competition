import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, message, DatePicker } from "antd";
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
      loadData();
      setForm({
        tournamentName: "",
        description: "",
        startDate: null,
        endDate: null,
        maxRounds: "",
      });
    }
  };

  // ลบข้อมูล
  const handleDelete = async (id) => {
    await deleteTournament(id);
    loadData();
  };

  // เปิด modal สำหรับแก้ไขข้อมูล
  const handleEdit = (record) => {
    setEditingRecord(record);
    formEdit.setFieldsValue({
      tournamentName: record.tournamentName,
      description: record.description,
      startDate: record.startDate ? moment(record.startDate.toDate()) : null,
      endDate: record.endDate ? moment(record.endDate.toDate()) : null,
      maxRounds: record.maxRounds,
    });
    setIsModalVisible(true);
  };

  // อัปเดตข้อมูล
  const handleUpdate = async () => {
    const values = await formEdit.validateFields();
    if (await updateTournament(editingRecord.id, values)) {
      setIsModalVisible(false);
      setEditingRecord(null);
      loadData();
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
      render: (timestamp) =>
        timestamp
          ? new Date(timestamp.seconds * 1000).toLocaleDateString()
          : "",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (timestamp) =>
        timestamp
          ? new Date(timestamp.seconds * 1000).toLocaleDateString()
          : "",
    },
    { title: "Max Rounds", dataIndex: "maxRounds", key: "maxRounds" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} type="primary">
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(record.id)}
            danger
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
      <Input
        onChange={handleChange}
        value={form.tournamentName}
        type="text"
        name="tournamentName"
        placeholder="Tournament Name"
        style={{ marginBottom: "10px" }}
      />
      <Input
        onChange={handleChange}
        value={form.description}
        type="text"
        name="description"
        placeholder="Description"
        style={{ marginBottom: "10px" }}
      />
      <DatePicker
        onChange={(date, dateString) =>
          handleDateChange(date, dateString, "startDate")
        }
        value={form.startDate ? moment(form.startDate, "YYYY-MM-DD") : null}
        format="YYYY-MM-DD"
        style={{ width: "100%", marginBottom: "10px" }}
        placeholder="Start Date"
      />
      <DatePicker
        onChange={(date, dateString) =>
          handleDateChange(date, dateString, "endDate")
        }
        value={form.endDate ? moment(form.endDate, "YYYY-MM-DD") : null}
        format="YYYY-MM-DD"
        style={{ width: "100%", marginBottom: "10px" }}
        placeholder="End Date"
      />
      <Input
        onChange={handleChange}
        value={form.maxRounds}
        type="number"
        name="maxRounds"
        placeholder="Max Rounds"
        style={{ marginBottom: "10px" }}
      />
      <Button onClick={handleAddData} type="primary">
        Add Data
      </Button>
      <hr />
      <Table dataSource={data} columns={columns} rowKey="id" />

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
