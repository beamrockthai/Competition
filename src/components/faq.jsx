// FAQ.jsx
import React from "react";
import { Collapse } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const FAQ = () => {
  return (
    <div
      style={{
        maxWidth: "2000px",
        margin: "60px auto 0",
        padding: "40px 15px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "26px",
            color: "#1f1f1f",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <QuestionCircleOutlined style={{ color: "#b12341" }} />
          คำถามที่พบบ่อย (FAQ)
        </h2>
        <p style={{ fontSize: "15px", color: "#888", marginTop: "8px" }}>
          รวมคำถามที่ผู้ใช้งานถามบ่อย พร้อมคำตอบแบบกระชับ
        </p>
      </div>

      <Collapse
        accordion
        bordered={false}
        expandIconPosition="right"
        style={{
          background: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        <Panel
          header="สมัครใช้งานเว็บไซต์ได้อย่างไร?"
          key="1"
          style={{ borderBottom: "1px solid #eee" }}
        >
          <p>
            คุณสามารถสมัครใช้งานได้โดยคลิกปุ่ม <strong>‘สมัครสมาชิก’</strong>{" "}
            ที่มุมขวาบนของหน้าเว็บไซต์ และกรอกข้อมูลให้ครบถ้วน
          </p>
        </Panel>
        <Panel
          header="ลืมรหัสผ่านต้องทำอย่างไร?"
          key="2"
          style={{ borderBottom: "1px solid #eee" }}
        >
          <p>
            คลิกที่ลิงก์ <strong>‘ลืมรหัสผ่าน’</strong> ในหน้าเข้าสู่ระบบ
            แล้วกรอกอีเมลที่คุณใช้ลงทะเบียน
            ระบบจะส่งลิงก์รีเซ็ตรหัสผ่านให้ทางอีเมล
          </p>
        </Panel>
        <Panel header="ติดต่อทีมงานได้ที่ไหน?" key="3">
          <p>
            คุณสามารถติดต่อทีมงานได้ผ่านหน้า <strong>‘ติดต่อเรา’</strong>{" "}
            หรือส่งอีเมลมาที่{" "}
            <a href="mailto:support@example.com" style={{ color: "#b12341" }}>
              support@example.com
            </a>
          </p>
        </Panel>
      </Collapse>
    </div>
  );
};

export default FAQ;
