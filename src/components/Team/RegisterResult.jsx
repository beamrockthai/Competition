import { Button, Result } from "antd";
export const RegisterResultPage = () => (
  <Result
    status="success"
    title="บันทึกข้อมูลทีมสำเร็จแล้ว คุณสามารถตรวจสอบข้อมูลได้ในเมนู ทีมของฉัน"
    subTitle="หากมีข้อสงสัยเพิ่มเติม กรุณาติดต่อฝ่ายพัฒนาระบบสารสนเทศ โทร.02-555-2000 ต่อ 2315"
    extra={[
      <Button
        type="primary"
        key="team"
        onClick={() => window.location.assign("/team")}
      >
        ทีมของฉัน
      </Button>,
      <Button key="home" onClick={() => window.location.assign("/")}>
        กลับหน้าแรก
      </Button>,
    ]}
  />
);
