import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Popconfirm,
  Skeleton,
  Spin,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { authUser, PATH_API } from "../../../constrant";
import { useEffect, useRef, useState } from "react";
export const TeamMemberPage = (props) => {
  const dataFetchedRef = useRef(false);
  const teamid = props.data;
  const [form] = Form.useForm();
  const [teamData, setTeamData] = useState();
  const onFinish = async (values) => {
    console.log("Success:", values.items[0]);
    console.log("PAONN", values);

    for (var i = 0; i < values.items.length; i++) {
      console.log(values.items[i]);
      await axios
        .post(PATH_API + "/users/create", {
          ...values.items[i],
          IsPresident: "No",
          GroupId: teamData.id,
        })
        .then((res) => {
          console.log("Created", res);
        });
    }
  };
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
    setTeamData(null);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  // const getTeamMembers = async () => {
  //   await axios
  //     .get(PATH_API + `/users/getteammembers/${teamData.id}`)
  //     .then((res) => {
  //       console.log("ffffffff", res);

  //       form.setFieldValue("items", res.data);
  //     });
  // };
  const confirm = () => {
    const memberId = form.getFieldValue(["items", field.name, "id"]); // ดึงค่า id ของสมาชิก
    console.log("Deleting member with ID:", memberId);

    if (memberId) {
      axios
        .post(`${PATH_API}/users/delete/${memberId}/${authUser.uid}`)
        .then((res) => {
          console.log("Member deleted:", res);
        })
        .catch((err) => {
          console.error("Error deleting member:", err);
        });
    }
  };
  const getMyTeam = () => {
    axios.get(PATH_API + `/groups/getbyteamid/${teamid}`).then((res) => {
      console.log(res.data);

      setTeamData(res.data);
      axios
        .get(PATH_API + `/users/getteammembers/${res.data.id}`)
        .then((res) => {
          console.log("getteammembers", res);

          form.setFieldValue("items", res.data);
        });
    });
  };
  useEffect(() => {
    if (!teamid) return; // ถ้า teamid ไม่มีค่า ไม่ต้องโหลด
    getMyTeam();
  }, [teamid]); // เมื่อ teamid เปลี่ยน ให้เรียก API ใหม่
  return (
    <>
      {teamid}
      {JSON.stringify(teamData)}
      {teamData ? (
        <Card>
          <h1>ข้อมูลสมาชิกในทีม</h1>
          <Form
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            form={form}
            name="dynamic_form_complex"
            style={{
              maxWidth: 600,
            }}
            autoComplete="off"
            initialValues={{
              items: [{}],
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <div
                  style={{
                    display: "flex",
                    rowGap: 16,
                    flexDirection: "column",
                  }}
                >
                  {fields.map((field) => (
                    <Card
                      size="small"
                      // title={(() => {
                      //   const memberId = form.getFieldValue([
                      //     "items",
                      //     field.name,
                      //     "id",
                      //   ]); // ดึง id จากฟอร์ม
                      //   const isPresident = presidentData
                      //     ? memberId === presidentData.id &&
                      //       presidentData.IsPresident === "Yes"
                      //       ? "หัวหน้าทีม"
                      //       : "สมาชิก"
                      //     : null;

                      //   return isPresident;
                      // })()}
                      key={field.key}
                      extra={
                        <CloseOutlined
                          onClick={() => {
                            <Popconfirm
                              title="Delete the task"
                              description="Are you sure to delete this task?"
                              onConfirm={confirm}
                              onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button danger>Delete</Button>
                            </Popconfirm>;
                            // remove(field.name); // ลบฟอร์มของสมาชิกออกจาก UI
                          }}
                        />
                      }
                    >
                      <Form.Item label="id" name={[field.name, "id"]}>
                        <Input disabled={true} />
                      </Form.Item>
                      <Form.Item
                        label="ชื่อ"
                        name={[field.name, "FirstName"]}
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
                        label="นามสกุล"
                        name={[field.name, "LastName"]}
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
                        label="เลขบัตรประชาชน"
                        name={[field.name, "NationalId"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input your Email!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      {/* <Form.Item
                      label="วันเกิด"
                      name={[field.name, "DateofBirth"]}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Please input your Email!",
                      //   },
                      // ]}
                    >
                      <DatePicker />
                    </Form.Item> */}

                      <Form.Item
                        label="อาชีพ"
                        name={[field.name, "Occupation"]}
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
                        label="สังกัดสถานศึกษา"
                        name={[field.name, "AffiliatedAgency"]}
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
                        label="ที่อยู่ปัจจุบัน"
                        name={[field.name, "Address1"]}
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
                        label="เบอร์ติดต่อ"
                        name={[field.name, "Phone"]}
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
                        label="Line ID"
                        name={[field.name, "LineId"]}
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
                        label="Email"
                        name={[field.name, "Email"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input your Email!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Card>
                  ))}

                  <Button type="dashed" onClick={() => add()} block>
                    + เพิ่มสมาชิก
                  </Button>
                </div>
              )}
            </Form.List>
            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <Card>
          <Spin tip=" กำลังรับข้อมูล..." />

          <Skeleton active />
        </Card>
      )}
    </>
  );
};
