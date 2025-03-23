import { Button, Result } from "antd";

export const NonAccessPage = () => {
  return (
    <Result
      status={"403"}
      title={<span style={{ color: "white" }}>คุณไม่มีสิทธิ์เข้าถึง</span>}
      subTitle={
        <span style={{ color: "white" }}>
          โปรดติดต่อผู้มีสิทธิ์ ในการอนุญาตจัดการข้อมูลเพื่อดำเนินการต่อ
        </span>
      }
      extra={[
        <Button
          key={"back"}
          type="primary"
          onClick={() => {
            window.location.assign("/");
          }}
        >
          กลับไปหน้าหลัก
        </Button>,
      ]}
    />
  );
};
