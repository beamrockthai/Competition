import {
  Button,
  Card,
  Checkbox,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  message,
  notification,
  Row,
} from "antd";
import axios from "axios";
import { PATH_API } from "../../constrant";

export const LoginRegisPage = () => {
  const onFinish = (values) => {
    console.log("ggggggg");
    console.log("Success:", { ...values, IsPresident: "Yes", Role: 4 });
    axios
      .post(PATH_API + `/users/register`, {
        ...values,
        IsPresident: "Yes",
        Role: 4,
      })
      .then((res) => {
        console.log("ฟฟฟฟฟฟ", res.message);
        if (res.status === 409) {
          message.error("ข้อมูลซ้ำหรืออาจเคยลงทะเบียนแล้ว");
        }

        window.location = "/userlogin";
        console.log("ggggggg", res);
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "#494949",
        },
      }}
    >
      <div className="body">
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <h1>สร้างบัญชีผู้ใช้</h1>
            <h4>
              มีบัญชีอยู่แล้วใช่ไหม? <a href="/userlogin">ลงชื่อเข้าใช้</a>
            </h4>
            <Col span={12}>
              {" "}
              <Divider />
            </Col>

            <h4> ทำไมการป้องกันด้วยรหัสผ่านจึงมีความสำคัญ?</h4>
            <p>
              รหัสผ่านเป็นแนวป้องกันด่านแรกของคุณต่อการเข้าถึงบัญชีออนไลน์
              อุปกรณ์ และไฟล์ของคุณโดยไม่ได้รับอนุญาต
              รหัสผ่านที่แข็งแกร่งจะช่วยปกป้องข้อมูลของคุณจากผู้โจมตีและซอฟต์แวร์ที่เป็นอันตราย
              ยิ่งรหัสผ่านเดายาก ข้อมูลของคุณก็จะยิ่งได้รับการปกป้องมากขึ้น
              การใช้รหัสผ่านที่อ่อนแอก็เหมือนกับการลืมล็อกประตูรถหรือบ้าน
              ซึ่งไม่ปลอดภัยเลย
            </p>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Card style={{ border: "none" }}>
              <h1 style={{ color: "white" }}>สร้างบัญชีผู้ใช้</h1>
              <Form
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                style={{
                  maxWidth: 600,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Email"
                  name="Email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Email!",
                      type: "email",
                    },
                  ]}
                >
                  <Input type="email" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="Confirm Password"
                  name="Password2"
                  dependencies={["Password"]}
                  rules={[
                    {
                      required: true,
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("Password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The new password that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="เบอร์โทรศัพท์"
                  name="Phone"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Email!",
                    },
                  ]}
                >
                  <Input inputMode="numeric" />
                </Form.Item>

                <Form.Item label={null}>
                  <Button type="primary" htmlType="submit">
                    Sign Up
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};
