import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Radio, Button, message, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
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
      const values = await form.validateFields();

      if (!tournament || !tournament.id) {
        message.error("ไม่พบข้อมูลการแข่งขัน");
        return;
      }

      const teamName = values.teamName || "";
      const teamMembers = values.teamMembers || [];

      console.log("🟢 Final Data:", {
        tournamentId: tournament.id,
        userId,
        teamType,
        teamMembers,
        teamName,
      });

      setLoading(true);
      await registerTournament(
        tournament.id,
        userId,
        teamType,
        teamMembers,
        teamName
      );

      message.success("สมัครแข่งขันสำเร็จ!");
      form.resetFields();
      onClose();
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
              <Input placeholder="เช่น ทีมตําบล" />
            </Form.Item>

            <Form.List name="teamMembers" initialValue={[""]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: "8px" }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={name}
                        fieldKey={fieldKey}
                        rules={[
                          { required: true, message: "กรุณากรอกชื่อสมาชิก" },
                        ]}
                      >
                        <Input placeholder="ชื่อสมาชิก เช่น นาย ธัชนนท์ รอดวงษ์" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      เพิ่มสมาชิก
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </>
        )}

        {/* ปุ่มสมัคร */}
        <Button
          danger
          type="primary"
          onClick={handleRegister}
          loading={loading}
          block
        >
          สมัครแข่งขัน
        </Button>
      </Form>
    </Modal>
  );
};

export default TournamentRegister;
