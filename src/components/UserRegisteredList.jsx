import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, message, Spin } from "antd";
import { fetchUserRegistrations } from "../services/fetchUserRegistrations";
import { cancelRegistration } from "../services/cancelRegistration";
import { useUserAuth } from "../Context/UserAuth"; // ใช้เพื่อดึง user ID

const UserRegisteredList = () => {
  const { user } = useUserAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRegistrations();
    }
  }, [user]);

  const loadRegistrations = async () => {
    setLoading(true);
    try {
      const data = await fetchUserRegistrations(user.uid);
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
    <div style={{ padding: "20px" }}>
      <h2>รายการที่คุณลงทะเบียนไว้</h2>

      {loading ? (
        <Spin size="large" />
      ) : registrations.length === 0 ? (
        <p>ยังไม่มีการแข่งขันที่คุณสมัคร</p>
      ) : (
        <Row gutter={[16, 16]}>
          {registrations.map((reg) => (
            <Col key={reg.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={reg.tournamentName}
                bordered={false}
                style={{ width: "100%" }}
              >
                <p>
                  <b>ประเภท:</b>{" "}
                  {reg.teamType === "individual" ? "เดี่ยว" : "ทีม"}
                </p>
                {reg.teamType === "team" && (
                  <>
                    <p>
                      <b>ชื่อทีม:</b> {reg.teamName || "ไม่ได้ระบุ"}
                    </p>
                    <p>
                      <b>สมาชิก:</b>
                    </p>
                    <ul style={{ paddingLeft: "20px" }}>
                      {reg.teamMembers.map((member, index) => (
                        <li key={index}>
                          {index + 1}. {member}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <Button
                  danger
                  block
                  onClick={() => handleCancel(reg.id, reg.tournamentId)}
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
