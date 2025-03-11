import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Row,
  Col,
  Table,
  Select,
  Tag,
} from "antd";
import moment from "moment";
import {
  fetchTournaments,
  addTournament,
  deleteTournament,
  updateTournament,
  getTournamentRegistrations,
} from "../../services/tournamentService";
import TournamentTable from "./TournamentTable";
import TableComponent from "../../components/TableComponent"; // นำเข้า TableComponent

export const AdminTournamentPage = () => {
  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    setLoading(true);
    try {
      const data = await fetchTournaments();
      // const tournamentsWithCount = await Promise.all(
      //   data.map(async (tournament) => {
      //     const count = await getTournamentRegistrations(tournament.id);
      //     return { ...tournament, registrationCount: count };
      //   })
      // );
      setTournaments(data.data);
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTournament = async (values) => {
    await addTournament({ ...values, status: values.status || false }); // เพิ่มค่า status
    setModalVisible(false);
    form.resetFields();
    loadTournaments();
  };

  const handleEditTournament = (record) => {
    setEditingTournament(record);
    formEdit.setFieldsValue({
      CompetitionTypeName: record.CompetitionTypeName,
      EventDetials: record.CompetitionTypeName,
      // startDate: record.startDate ? moment(record.startDate.toDate()) : null,
      // endDate: record.endDate ? moment(record.endDate.toDate()) : null,
      // maxRounds: record.maxRounds,
      IsOpened: record.IsOpened ?? "No", // ✅ ถ้า `status` ไม่มีค่า ให้ใช้ `false` แทน
    });
    setEditModalVisible(true);
  };

  const handleUpdateTournament = async () => {
    try {
      const values = await formEdit.validateFields();
      const updatedTournament = {
        ...values,
        // startDate: values.startDate ? values.startDate.toDate() : null,
        // endDate: values.endDate ? values.endDate.toDate() : null,
        IsOpened: values.IsOpened, // อัปเดตค่า status
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

  const columns = TournamentTable({ handleEditTournament, handleDelete });
  // const columns = [
  //   {
  //     title: "ชื่อการแข่งขัน",
  //     dataIndex: "CompetitionTypeName",
  //   },
  //   {
  //     title: "คำอธิบาย",
  //     dataIndex: "Details",
  //   },

  //   //เเปลงวันที่ก่อน
  //   {
  //     title: "วันเริ่มต้น",
  //     dataIndex: "startDate",
  //     render: (date) => {
  //       console.log("Date value:", date);
  //       if (date) {
  //         // ตรวจสอบว่าเป็น Firebase Timestamp หรือไม่
  //         if (date.toDate) {
  //           return moment(date.toDate()).format("DD/MM/YYYY");
  //         }
  //         // ใช้ moment กับค่าที่เป็น String หรือ Date Object
  //         const parsedDate = moment(date);
  //         return parsedDate.isValid() ? parsedDate.format("DD/MM/YYYY") : "-";
  //       }
  //       return "-";
  //     },
  //   },
  //   {
  //     title: "วันสิ้นสุด",
  //     dataIndex: "endDate",
  //     render: (date) => {
  //       if (date) {
  //         // ตรวจสอบว่าเป็น Firebase Timestamp หรือไม่
  //         if (date.toDate) {
  //           return moment(date.toDate()).format("DD/MM/YYYY");
  //         }
  //         // ใช้ moment กับค่าที่เป็น String หรือ Date Object
  //         const parsedDate = moment(date);
  //         return parsedDate.isValid() ? parsedDate.format("DD/MM/YYYY") : "-";
  //       }
  //       return "-";
  //     },
  //   },
  //   {
  //     title: "จำนวนรอบสูงสุด",
  //     dataIndex: "maxRounds",
  //   },

  //   {
  //     title: "จำนวนผู้สมัคร",
  //     dataIndex: "registrationCount",
  //   },

  //   {
  //     title: "สถานะ",
  //     dataIndex: "status",
  //     width: 120,
  //     render: (status) => (
  //       <Tag color={status ? "green" : "red"}>
  //         {status ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
  //       </Tag>
  //     ),
  //   },

  //   {
  //     title: "การจัดการ",
  //     key: "actions",
  //     render: (_, record) => (
  //       <>
  //         <Button type="primary" onClick={() => handleEditTournament(record)}>
  //           แก้ไข
  //         </Button>
  //         <Button
  //           danger
  //           onClick={() => handleDelete(record.id)}
  //           style={{ marginLeft: 8 }}
  //         >
  //           ลบ
  //         </Button>
  //       </>
  //     ),
  //   },
  // ];
  return (
    <div style={{ padding: "20px" }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <Col>
          <h2>จัดการการแข่งขัน</h2>
        </Col>
        <Col>
          <Button
            style={{ backgroundColor: "#b12341", borderColor: "#b12341" }}
            type="primary"
            onClick={() => setModalVisible(true)}
          >
            สร้างการแข่งขัน
          </Button>
        </Col>
      </Row>
      {/* ใช้ TableComponent แทน Table */}
      {/* <TableComponent
        dataSource={tournaments}
        columns={columns}
        rowKey="id"
        loading={loading}
      /> */}
      {"ต้องมีหน้าจัดการฟอร์มในนี้"}
      <Table
        dataSource={tournaments}
        columns={columns}
        loading={loading}
        rowKey="id"
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
            name="CompetitionTypeName"
            label="ชื่อการแข่งขัน"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Details"
            label="รายละเอียด"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          {/* <Form.Item
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
          </Form.Item> */}
          {/* <Form.Item
            name="maxRounds"
            label="จำนวนรอบสูงสุด"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item> */}
          <Form.Item name="IsOpened" label="สถานะ" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={"Yes"}>เปิดรับสมัคร</Select.Option>
              <Select.Option value={"No"}>ปิดรับสมัคร</Select.Option>
            </Select>
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
            name="CompetitionTypeName"
            label="ชื่อการแข่งขัน"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Details"
            label="รายละเอียด"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          {/* <Form.Item
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
          </Form.Item> */}
          <Form.Item name="IsOpened" label="สถานะ" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={"Yes"}>เปิดรับสมัคร</Select.Option>
              <Select.Option value={"No"}>ปิดรับสมัคร</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

