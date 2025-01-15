// ฟอร์มสมัครแข่งขัน
import React, { useState } from "react";
import { Modal, Form, Input, Radio, Button, message } from "antd";
import { registerTournament } from "../services/registrationService";

const TournamentRegister = ({ visible, onClose, tournament, userId }) => {
  const [form] = Form.useForm();
  const [teamType, setTeamType] = useState("individual");

  const handleRegister = async () => {
    try {
      const values = await form.validateFields();
      await registerTournament({
        userId,
        tournamentId: tournament.id,
        tournamentName: tournament.tournamentName,
        teamType,
        teamMembers: teamType === "team" ? values.teamMembers.split(",") : [],
      });
      message.success("สมัครแข่งขันสำเร็จ!");
      onClose();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการสมัคร");
    }
  };

  return (
    <Modal
      title="สมัครแข่งขัน"
      open={visible}
      onOk={handleRegister}
      onCancel={onClose}
    >
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
      </Form>
    </Modal>
  );
};

export default TournamentRegister;
