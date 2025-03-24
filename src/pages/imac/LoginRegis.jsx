import {
  Button,
  Card,
  Checkbox,
  Col,
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
    <div className="body">
      <Row>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <h1>Create New Account</h1>
          <h4>
            Already registered? <a href="/userlogin">Login</a>
          </h4>
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
            <h1>Sign Up</h1>
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
  );
};
