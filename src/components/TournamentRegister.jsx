import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Radio, Button, message } from "antd";
import { registerTournament } from "../services/registrationService";

const TournamentRegister = ({ visible, onClose, tournament, userId }) => {
  const [form] = Form.useForm();
  const [teamType, setTeamType] = useState("individual");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  const handleRegister = async () => {
    try {
      const values = await form.validateFields();

      console.log("🟢 Form Values:", values);
      console.log("🟢 Tournament:", tournament);
      console.log("🟢 User ID:", userId);

      if (!tournament || !tournament.id) {
        message.error("ไม่พบข้อมูลการแข่งขัน");
        return;
      }

      const teamMembers =
        teamType === "team" && values.teamMembers
          ? values.teamMembers.split(",").map((name) => name.trim())
          : [];

      console.log("🟢 Final Data:", {
        tournamentId: tournament.id,
        userId,
        teamType,
        teamMembers,
      });

      setLoading(true);
      await registerTournament(tournament.id, userId, teamType, teamMembers);

      message.success("สมัครแข่งขันสำเร็จ!");
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการสมัคร");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="สมัครแข่งขัน" open={visible} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical">
        <Form.Item label="ประเภทการแข่งขัน">
          <Radio.Group
            value={teamType}
            onChange={(e) => setTeamType(e.target.value)}
          >
            <Radio value="individual">เดี่ยว</Radio>
            <Radio value="team">ทีม</Radio>
          </Radio.Group>
        </Form.Item>
        {teamType === "team" && (
          <Form.Item
            label="ชื่อสมาชิกในทีม (คั่นด้วย ,)"
            name="teamMembers"
            rules={[{ required: true, message: "กรุณากรอกชื่อสมาชิก" }]}
          >
            <Input.TextArea rows={3} placeholder="เช่น สมชาย, สมศรี, สมปอง" />
          </Form.Item>
        )}
        <Button type="primary" onClick={handleRegister} loading={loading} block>
          สมัครแข่งขัน
        </Button>
      </Form>
    </Modal>
  );
};

export default TournamentRegister;
