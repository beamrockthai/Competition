import { Button, Card, Form, message, Popconfirm, Steps, theme } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { authUser, PATH_API } from "../../../constrant";

import { TeamEditPage } from "./TeamEdit";
import { TeamUploadPage } from "./TeamUpload";
import { RegisterResultPage } from "../../../components/Team/RegisterResult";

export const TeamStepsPage = () => {
  //   const [value, setValue] = useState(1);

  const [current, setCurrent] = useState(1);
  const { token } = theme.useToken();

  const cancel = (e) => {
    console.log(e);
    // message.error("Click on No");
  };

  const steps = [
    {
      title: "กำหนดชื่อทีม",
      content: null,
    },
    {
      title: "ข้อมูลสมาชิก",
      content: <TeamEditPage />,
    },
    {
      title: "ส่งผลงาน",
      content: <TeamUploadPage />,
    },
    {
      title: "เสร็จสิ้น",
      content: <RegisterResultPage />,
    },
  ];
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    // lineHeight: "260px",
    // textAlign: "center",
    // color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  return (
    <div>
      <Card>
        <Steps current={current} items={items} />
        <div style={contentStyle}>{steps[current].content}</div>
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "flex-end", // ทำให้ปุ่มชิดขวา
            gap: "8px", // เพิ่มช่องว่างระหว่างปุ่ม
          }}
        >
          {current < steps.length - 1 && (
            <Popconfirm
              title="อย่าลืม! กดบันทึกข้อมูลก่อน"
              description="กดบันทึกข้อมูลแต่ละส่วนก่อนกดถัดไป ข้อมูลในฟอร์มจะถูกรีเซ็ต"
              onConfirm={() => next()}
              onCancel={cancel}
              okText="ถัดไป"
              cancelText="ยกเลิก"
            >
              <Button type="primary">ถัดไป</Button>
            </Popconfirm>
          )}
          {current === steps.length - 1 ||
            (current === steps.length && (
              <Popconfirm
                title="อย่าลืม! กดบันทึกข้อมูลก่อน"
                description="กดบันทึกข้อมูลแต่ละส่วนก่อนกดถัดไป ข้อมูลในฟอร์มจะถูกรีเซ็ต"
                onConfirm={() => next()}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  onClick={() => message.success("บันทึกข้อมูลเสร็จสิ้น!")}
                >
                  เสร็จสิ้น
                </Button>
              </Popconfirm>
            ))}
          {current > 1 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              ก่อนหน้า
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
