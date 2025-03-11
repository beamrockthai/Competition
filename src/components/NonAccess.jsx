import { Button, Result } from "antd";

export const NonAccessPage = () => {
  return (
    <Result
      status={"403"}
      title="คุณไม่มีสิทธิ์เข้าถึง"
      subTitle="โปรดติดต่อผู้มีสิทธิ์ ในการอนุญาตจัดการข้อมูลเพื่อดำเนินการต่อ"
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
