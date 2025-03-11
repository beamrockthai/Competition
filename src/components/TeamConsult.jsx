import { Button, Card, DatePicker, Form, Input, Skeleton, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { authUser, PATH_API } from "../constrant";
import { useEffect, useRef, useState } from "react";
export const TeamConsultPage = (props) => {
  const dataFetchedRef = useRef(false);
  const presidentData = props.data;
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
          IsPresident: "Consult",
          GroupId: teamData.id,
        })
        .then((res) => {
          console.log("Created", res);
        });
    }
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
  const getMyTeam = async () => {
    await axios
      .get(PATH_API + `/groups/getbyid/${authUser.uid}`)
      .then((res) => {
        setTeamData(res.data);
        axios
          .get(PATH_API + `/users/getteamconsult/${res.data.id}`)
          .then((res) => {
            console.log("getteamconsult", res);

            form.setFieldValue("items", res.data);
          });
      });
  };
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getMyTeam();
    // getTeamMembers();
  }, []);
  return (
    <>
      {teamData ? (
        <Card>
          <h1>ข้อมูลที่ปรึกษา/อาจารย์ของทีม</h1>
          <Form
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            form={form}
            name="consult_form"
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
                      title={(() => {
                        const memberId = form.getFieldValue([
                          "items",
                          field.name,
                          "IsPresident",
                        ]); // ดึง id จากฟอร์ม
                        {
                          JSON.stringify(memberId);
                        }
                        const title = memberId
                          ? memberId === "Consult"
                            ? "ที่ปรึกษา"
                            : null
                          : null;
                        return title;
                      })()}
                      key={field.key}
                      extra={
                        <CloseOutlined
                          onClick={() => {
                            const memberId = form.getFieldValue([
                              "items",
                              field.name,
                              "id",
                            ]); // ดึงค่า id ของสมาชิก
                            console.log("Deleting member with ID:", memberId);

                            if (memberId) {
                              axios
                                .post(
                                  `${PATH_API}/users/delete/${memberId}/${authUser.uid}`
                                )
                                .then((res) => {
                                  console.log("Member deleted:", res);
                                  remove(field.name); // ลบฟอร์มของสมาชิกออกจาก UI
                                })
                                .catch((err) => {
                                  console.error("Error deleting member:", err);
                                });
                            }
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
                    + ที่ปรึกษา / อาจารย์
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
          <h1>ข้อมูลที่ปรึกษา/อาจารย์ของทีม</h1>
          <Spin tip=" กำลังรับข้อมูล..." />

          <Skeleton active />
        </Card>
      )}
    </>
  );
};
