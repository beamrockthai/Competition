import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, message, Spin, Typography } from "antd";
import { fetchUserRegistrations } from "../services/fetchUserRegistrations";
import { cancelRegistration } from "../services/cancelRegistration";
import { useUserAuth } from "../Context/UserAuth";

const { Title, Text } = Typography; // ใช้ Typography จาก Ant Design

const UserRegisteredList = () => {
  const { userId } = useUserAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadRegistrations();
    }
  }, [userId]);

  const loadRegistrations = async () => {
    if (!userId) {
      message.error("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchUserRegistrations(userId);
      setRegistrations(data);
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (registrationId, tournamentId) => {
    try {
      await cancelRegistration(registrationId, tournamentId);
      message.success("ยกเลิกการสมัครเรียบร้อยแล้ว");
      loadRegistrations();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการยกเลิกการสมัคร");
    }
  };

  return (
    <div style={{ padding: "25px", maxWidth: "1200px", margin: "auto" }}>
      <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
        รายการที่คุณลงทะเบียนไว้
      </Title>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <Spin size="large" />
        </div>
      ) : registrations.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888", fontSize: "16px" }}>
          ยังไม่มีการแข่งขันที่คุณสมัคร
        </p>
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {registrations.map((reg) => (
            <Col key={reg.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={
                  <Title level={5} style={{ margin: 0, color: "#722ed1" }}>
                    {reg.tournamentName}
                  </Title>
                }
                bordered={true}
                style={{
                  borderRadius: "10px",
                  background: "#fafafa",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                }}
              >
                <Text strong>ประเภท:</Text>{" "}
                <Text>{reg.teamType === "individual" ? "เดี่ยว" : "ทีม"}</Text>
                <br />
                {reg.teamType === "team" && (
                  <>
                    <Text strong>ชื่อทีม:</Text>{" "}
                    <Text>{reg.teamName || "ไม่ได้ระบุ"}</Text>
                    <br />
                    <Text strong>สมาชิกในทีม:</Text>
                    <ul style={{ paddingLeft: "20px", textAlign: "left" }}>
                      {reg.teamMembers && reg.teamMembers.length > 0 ? (
                        reg.teamMembers.map((member, index) => (
                          <li key={index}>
                            {index + 1}. {member}
                          </li>
                        ))
                      ) : (
                        <Text type="secondary">ไม่มีสมาชิกในทีม</Text>
                      )}
                    </ul>
                  </>
                )}
                <Button
                  danger
                  block
                  onClick={() => handleCancel(reg.id, reg.tournamentId)}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#ff4d4f",
                    borderColor: "#ff4d4f",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                  size="large"
                >
                  ยกเลิกการสมัคร
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default UserRegisteredList;
