import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
} from "antd";
import axios from "axios";
import { authUser, PATH_API } from "../../constrant";
import { useEffect, useState } from "react";

export const UserLoginPage = () => {
  const [loadings, setLoadings] = useState(false);
  const onFinish = (values) => {
    setLoadings(true);
    console.log("Success:", values);
    axios.post(PATH_API + `/users/login`, values).then((res) => {
      // window.location = "/team";
      if (res.status === 200 && res.data.Role === 4) {
        localStorage.setItem("user", JSON.stringify(res.data));
        // setLoadings(false);
        message.success(
          `Welcome ${res.data.FirstName || null} ${res.data.LastName || null}`
        );

        setTimeout(() => window.location.assign("/"), 1000);
      }
      if (res.status === 200 && res.data.Role === 2) {
        localStorage.setItem("user", JSON.stringify(res.data));

        setTimeout(() => window.location.assign("/admin"), 1000);
        message.success(`Welcome ${res.data.FirstName} ${res.data.LastName}`);
      }
      if (res.status === 200 && res.data.Role === 3) {
        localStorage.setItem("user", JSON.stringify(res.data));

        setTimeout(() => window.location.assign("/director"), 1000);
        message.success(`Welcome ${res.data.FirstName} ${res.data.LastName}`);
      }
      if (res.status === 204) {
        message.warning("ไม่พบการลงทะเบียน หรือคุณไม่มีสิทธิ์ลงชื่อเข้าใช้", 5);
        setLoadings(false);
      }
      if (res.status === 203) {
        message.error(res.data.message);
        setLoadings(false);
      }

      console.log(res);
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    if (authUser) {
      window.location.assign("/team");
    }
  }, []);
  return (
    <div className="body">
      <Row>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <h1>Login</h1>
          <h4>Sign in to continue</h4>
          <Divider />
          <h4>Why is password protection important?</h4>
          <p>
            Passwords are your first line of defense against unauthorized access
            to your online accounts, devices, and files. Strong passwords help
            protect your information from attackers and malicious software. The
            harder a password is to guess, the more your information is
            protected. Using a weak password is like leaving your car or house
            door unlocked it's simply not safe.
          </p>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Card>
            <h1>Sign in</h1>
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
                <Input />
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

              <Form.Item label={null}>
                <Button loading={loadings} type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
