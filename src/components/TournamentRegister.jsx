import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Radio, Button, message } from "antd";
import { registerTournament } from "../services/registrationService";

const TournamentRegister = ({ visible, onClose, tournament, userId }) => {
  const [form] = Form.useForm();
  const [teamType, setTeamType] = useState("individual");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      form.resetFields(); // รีเซ็ตฟอร์มทุกครั้งที่ Modal แสดงผล
    }
  }, [visible]);

  const handleRegister = async () => {
    try {
      // ดึงค่าจากฟอร์ม
      const values = await form.validateFields();

      if (!tournament || !tournament.id) {
        message.error("ไม่พบข้อมูลการแข่งขัน");
        return;
      }

      // ดึงค่า teamName และ teamMembers
      const teamName = values.teamName || ""; // ดึงชื่อทีม กรณี teamType === 'team'
      const teamMembers =
        teamType === "team" && values.teamMembers
          ? values.teamMembers.split(",").map((name) => name.trim())
          : [];

      // ตรวจสอบข้อมูลสุดท้าย
      console.log("🟢 Final Data:", {
        tournamentId: tournament.id,
        userId,
        teamType,
        teamMembers,
        teamName, // แสดงค่า teamName
      });

      setLoading(true);
      await registerTournament(
        tournament.id,
        userId,
        teamType,
        teamMembers,
        teamName // ส่งชื่อทีมเข้าไป
      );

      message.success("สมัครแข่งขันสำเร็จ!");
      form.resetFields(); // ล้างฟอร์ม
      onClose(); // ปิด Modal
    } catch (error) {
      console.error("❌ Error registering for tournament:", error);
      message.error("เกิดข้อผิดพลาดในการสมัคร");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="สมัครแข่งขัน" open={visible} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical">
        {/* ประเภทการแข่งขัน */}
        <Form.Item label="ประเภทการแข่งขัน">
          <Radio.Group
            value={teamType}
            onChange={(e) => setTeamType(e.target.value)}
          >
            <Radio value="individual">ประเภทเดี่ยว</Radio>
            <Radio value="team">ประเภททีม</Radio>
          </Radio.Group>
        </Form.Item>

        {/* กรณีสมัครแบบทีม */}
        {teamType === "team" && (
          <>
            <Form.Item
              label="ชื่อทีม"
              name="teamName"
              rules={[{ required: true, message: "กรุณากรอกชื่อทีม" }]}
            >
              <Input placeholder="เช่น ทีมสุดแกร่ง" />
            </Form.Item>
            <Form.Item
              label="ชื่อสมาชิกในทีม (คั่นด้วย ,)"
              name="teamMembers"
              rules={[{ required: true, message: "กรุณากรอกชื่อสมาชิก" }]}
            >
              <Input.TextArea rows={3} placeholder="เช่น สมชาย, สมศรี, สมปอง" />
            </Form.Item>
          </>
        )}

        {/* ปุ่มสมัคร */}
        <Button type="primary" onClick={handleRegister} loading={loading} block>
          สมัครแข่งขัน
        </Button>
      </Form>
    </Modal>
  );
};

export default TournamentRegister;
