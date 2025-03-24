import { Button, Form, Input, message, Space } from "antd";
import axios from "axios";
import { authUser, PATH_API } from "../../../constrant";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const TeamUploadPage = () => {
  useEffect(() => {
    getMyTeam();
  }, []);
  const [form] = Form.useForm();
  const [teamData, setTeamData] = useState();
  const [buttonLoading, setButtonLoading] = useState();
  const onFinish = async (values) => {
    console.log("Success:", values);
    setButtonLoading(true);
    axios
      .patch(PATH_API + "/groups/update", {
        id: teamData.id,
        LinkGoogleDrive: values.LinkGoogleDrive,
        UpdatedBy: authUser.uid,
      })
      .then((res) => {
        console.log("Created", res);
        message.success("บันทึกลิงค์ผลงานเรียบร้อย!");
        setButtonLoading(false);
      });
  };
  const onFinishFailed = () => {
    message.error("กรุณากรอกข้อมูลลิงค์ผลงาน!");
  };
  const getMyTeam = async () => {
    await axios
      .get(PATH_API + `/groups/getbyid/${authUser.uid}`)
      .then((res) => {
        setTeamData(res.data);
        form.setFieldsValue({ LinkGoogleDrive: res.data.LinkGoogleDrive });
        console.log("myteam", res.data);
      });
  };
  //   const onFill = () => {
  //     form.setFieldsValue({
  //       url: "https://taobao.com/",
  //     });
  //   };
  return (
    <>
      <h2>
        ส่งผลงานที่เกี่ยวข้อง ผ่าน Link Google Drive และเปิดสิทธิ์ให้
        ทุกคนที่มีลิงค์สามารถดูได้
      </h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="LinkGoogleDrive"
          label="Link Google Drive"
          rules={[
            {
              type: "url",
              warningOnly: true,
            },
            {
              type: "string",
              min: 6,
            },
          ]}
        >
          <Input placeholder="Link Google Drive" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={buttonLoading}>
              บันทึกลิงค์
            </Button>
            {/* <Button htmlType="button" onClick={onFill}>
              Fill
            </Button> */}
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};
