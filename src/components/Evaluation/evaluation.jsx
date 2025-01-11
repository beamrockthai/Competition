// components/Evaluation/Evaluation.js
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
  Menu,
} from "antd";
import moment from "moment";
import {
  fetchEvaluation,
  addEvaluation,
  deleteEvaluation,
  updateEvaluation,
} from "./service/evaluationService";

export const Evaluation = () => {
  const [form, setForm] = useState({
    playerName: "",
    playerID: "",
    round: "",
    score: "",
    comments: "",
    startDate: null,
    endDate: null,
    judgeNameId: "",
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
    const evaluation = await fetchEvaluation();
    setData(evaluation);
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
    if (await addEvaluation(form)) {
      message.success("Evaluation added successfully");
      loadData();
      setForm({
        playerName: "",
        playerID: "",
        round: "",
        score: "",
        comments: "",
        startDate: null,
        endDate: null,
        judgeNameId: "",
      });
    } else {
      message.error("Failed to add Evaluation");
    }
  };

  // ลบข้อมูล
  const handleDelete = async (id) => {
    await deleteEvaluation(id);
    message.success("Evaluation deleted successfully");
    loadData();
  };

  // เปิด modal สำหรับแก้ไขข้อมูล
  const handleEdit = (record) => {
    setEditingRecord(record);
    formEdit.setFieldsValue({
      playerName: record.playerName,
      playerID: record.playerID,
      round: record.round,
      score: record.score,
      comments: record.comments,
      startDate: record.startDate ? moment(record.startDate.toDate()) : null,
      endDate: record.endDate ? moment(record.endDate.toDate()) : null,
      judgeNameId: record.judgeNameId,
    });
    setIsModalVisible(true);
  };

  // อัปเดตข้อมูล
  const handleUpdate = async () => {
    try {
      const values = await formEdit.validateFields();
      const updatedValues = {
        ...values,
        startDate: values.startDate, // ส่ง moment object
        endDate: values.endDate, // ส่ง moment object
      };
      if (await updateEvaluation(editingRecord.id, updatedValues)) {
        message.success("Evaluation updated successfully");
        setIsModalVisible(false);
        setEditingRecord(null);
        loadData();
      } else {
        message.error("Failed to update Evaluation");
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
      title: "Player Name",
      dataIndex: "playerName",
      key: "playerName",
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      title: "Player ID",
      dataIndex: "playerID",
      key: "playerID",
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      title: "Round",
      dataIndex: "round",
      key: "round",
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) =>
        date ? moment(date.toDate()).format("YYYY-MM-DD") : "",
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) =>
        date ? moment(date.toDate()).format("YYYY-MM-DD") : "",
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "Judge Name ID",
      dataIndex: "judgeNameId",
      key: "judgeNameId",
      responsive: ["xs", "sm", "md", "lg", "xl"],
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
            Add
          </Button>
          <Button
            onClick={() => handleEdit(record)}
            type="primary"
            size="small"
            style={{ marginLeft: 8 }}
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
      <h2>สร้างใบประเมิน</h2>
      <Form layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Player Name" required>
              <Input
                name="playerName"
                placeholder="Player Name"
                value={form.playerName}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Player ID" required>
              <Input
                name="playerID"
                placeholder="Player ID"
                value={form.playerID}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Round" required>
              <Input
                name="round"
                placeholder="Round"
                value={form.round}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Score" required>
              <Input
                name="score"
                placeholder="Score"
                value={form.score}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Comments" required>
              <Input
                name="comments"
                placeholder="Comments"
                value={form.comments}
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
            <Form.Item label="Judge Name ID" required>
              <Input
                name="judgeNameId"
                placeholder="Judge Name ID"
                value={form.judgeNameId}
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
              เพิ่มใบประเมิน
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
        title="แก้ไขข้อมูลการสร้างใบประเมิน"
        open={isModalVisible}
        onOk={handleUpdate}
        onCancel={handleCancel}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <Form form={formEdit} layout="vertical">
          <Form.Item
            name="playerName"
            label="Player Name"
            rules={[{ required: true, message: "กรุณากรอกรายชื่อผู้เล่น" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="playerID"
            label="Player ID"
            rules={[{ required: true, message: "กรุณากรอก ID ผู้เล่น" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="round"
            label="Round"
            rules={[{ required: true, message: "กรุณากรอกรอกรอบ" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="score"
            label="Score"
            rules={[{ required: true, message: "กรุณากรอกคะแนน" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="comments"
            label="Comments"
            rules={[{ required: true, message: "กรุณาคอมเมนต์" }]}
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
            name="judgeNameId"
            label="Judge Name ID"
            rules={[{ required: true, message: "กรุณาใส่ ID กรรมการ" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
