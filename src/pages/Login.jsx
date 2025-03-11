import { Form, Input, Button, Checkbox, Row, Card, message } from "antd";
import axios from "axios";
import { useState } from "react";
import { authUser, PATH_API } from "../constrant";

export const LoginPage = () => {
  const [loadings, setLoadings] = useState(false);
  const onSubmit = (value) => {
    setLoadings(true);
    const newData = {
      Email: value.Email,
      Password: value.Password,
    };
    axios
      .post(PATH_API + "/users/login", newData)
      .then((res) => {
        if (res.status === 200) {
          // console.log(res);
          localStorage.setItem("user", JSON.stringify(res.data));
          // console.log("AUTH : " + authUser);
          setLoadings(false);
          window.location.assign("/admin");
        } else {
          /// call api error
          setLoadings(false);
          window.alert(res.data.message);
        }
      })
      .catch((err) => {
        if (err.response) {
          setLoadings(false);
          if (err.response.status === 401) {
            message.error("ข้อมูลลงชื่อเข้าใช้ไม่ถูกต้อง");
          }
          console.log(err.response.status);
        }
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ minHeight: "100vh" }}
      >
        <Card title="Plese Login First">
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
            onFinish={onSubmit}
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
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button loading={loadings} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Row>
    </div>
  );
};
