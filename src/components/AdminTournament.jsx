import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Grid,
  Row,
  Col,
} from "antd";
import moment from "moment";
import {
  fetchTournaments,
  addTournament,
  deleteTournament,
  updateTournament,
  getTournamentRegistrations,
} from "../services/tournamentService";

const { useBreakpoint } = Grid;

const AdminTournament = () => {
  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const screens = useBreakpoint();

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    setLoading(true);
    try {
      const data = await fetchTournaments();
      const tournamentsWithCount = await Promise.all(
        data.map(async (tournament) => {
          const count = await getTournamentRegistrations(tournament.id);
          return { ...tournament, registrationCount: count };
        })
      );
      setTournaments(tournamentsWithCount);
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTournament = async (values) => {
    await addTournament(values);
    setModalVisible(false);
    form.resetFields();
    loadTournaments();
  };

  const handleEditTournament = (record) => {
    setEditingTournament(record);
    formEdit.setFieldsValue({
      tournamentName: record.tournamentName,
      description: record.description,
      startDate: record.startDate ? moment(record.startDate.toDate()) : null,
      endDate: record.endDate ? moment(record.endDate.toDate()) : null,
      maxRounds: record.maxRounds,
    });
    setEditModalVisible(true);
  };

  const handleUpdateTournament = async () => {
    try {
      const values = await formEdit.validateFields();
      const updatedTournament = {
        ...values,
        startDate: values.startDate ? values.startDate.toDate() : null,
        endDate: values.endDate ? values.endDate.toDate() : null,
      };
      await updateTournament(editingTournament.id, updatedTournament);
      message.success("อัปเดตข้อมูลเรียบร้อยแล้ว");
      setEditModalVisible(false);
      setEditingTournament(null);
      loadTournaments();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
  };

  const handleDelete = async (id) => {
    await deleteTournament(id);
    loadTournaments();
  };

  const columns = [
    {
      title: "ชื่อการแข่งขัน",
      dataIndex: "tournamentName",
      key: "tournamentName",
    },
    { title: "คำอธิบาย", dataIndex: "description", key: "description" },
    {
      title: "วันเริ่มต้น",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) =>
        date && date.toDate ? moment(date.toDate()).format("YYYY-MM-DD") : "-",
    },
    {
      title: "วันสิ้นสุด",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) =>
        date && date.toDate ? moment(date.toDate()).format("YYYY-MM-DD") : "-",
    },
    {
      title: "จำนวนรอบสูงสุด",
      dataIndex: "maxRounds",
      key: "maxRounds",
    },
    {
      title: "จำนวนผู้สมัคร",
      dataIndex: "registrationCount",
      key: "registrationCount",
    },
    {
      title: "การจัดการ",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            size={screens.xs ? "small" : "middle"}
            onClick={() => handleEditTournament(record)}
          >
            แก้ไข
          </Button>
          <Button
            danger
            size={screens.xs ? "small" : "middle"}
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 8 }}
          >
            ลบ
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: screens.xs ? "10px" : "20px" }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <Col>
          <h2 style={{ fontSize: screens.xs ? "18px" : "24px" }}>
            จัดการการแข่งขัน
          </h2>
        </Col>
        <Col>
          <Button type="primary" onClick={() => setModalVisible(true)}>
            สร้างการแข่งขัน
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={tournaments}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ responsive: true }}
        scroll={{ x: "max-content" }}
      />

      {/* Modal สำหรับเพิ่มการแข่งขัน */}
      <Modal
        title="เพิ่มการแข่งขัน"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="เพิ่ม"
        cancelText="ยกเลิก"
      >
        <Form form={form} layout="vertical" onFinish={handleAddTournament}>
          <Form.Item
            name="tournamentName"
            label="ชื่อการแข่งขัน"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="รายละเอียด"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="วันเริ่มต้น"
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="วันสิ้นสุด"
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="maxRounds"
            label="จำนวนรอบสูงสุด"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal สำหรับแก้ไขการแข่งขัน */}
      <Modal
        title="แก้ไขการแข่งขัน"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleUpdateTournament}
        okText="อัปเดต"
        cancelText="ยกเลิก"
      >
        <Form form={formEdit} layout="vertical">
          <Form.Item
            name="tournamentName"
            label="ชื่อการแข่งขัน"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="รายละเอียด"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="วันเริ่มต้น"
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="วันสิ้นสุด"
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="maxRounds"
            label="จำนวนรอบสูงสุด"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminTournament;
