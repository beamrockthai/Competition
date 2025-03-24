import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Skeleton,
  Spin,
} from "antd";

import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { authUser, PATH_API } from "../constrant";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import buddhistEra from "dayjs/plugin/buddhistEra";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData"; // เพิ่ม plugin นี้
import thLocale from "antd/es/date-picker/locale/th_TH";
import "dayjs/locale/th";
import { UploadProfilePicture } from "./Team/UploadProfilePicture";

dayjs.extend(customParseFormat);
dayjs.extend(buddhistEra);
dayjs.extend(weekday);
dayjs.extend(localeData); // เรียกใช้ localeData
dayjs.locale("th");
const dateFormat = "YYYY-MM-DD";
export const TeamMemberPage = (props) => {
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getMyTeam();
    getNamePrefixOptions();
    getOccupationOptions();
    // getTeamMembers();
  }, []);
  const dataFetchedRef = useRef(false);
  const presidentData = props.data;
  const [form] = Form.useForm();
  const [teamData, setTeamData] = useState();
  const [namePrefixOptions, setNamePrefixOptions] = useState();
  const [OccupationOptions, setOccupationOptions] = useState();
  const [optionsLoading, setOptionsLoading] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);

  const onFinish = async (values) => {
    console.log("Success:", values.items[0]);
    console.log("PAONN", values);
    setButtonLoading(true);
    for (var i = 0; i < values.items.length; i++) {
      console.log(dayjs(values.items[i].DateofBirth, "DDMMYYYY"));
      await axios
        .post(PATH_API + "/users/create", {
          ...values.items[i],
          IsPresident: values.items[i].IsPresident
            ? values.items.IsPresident
            : "No",
          GroupId: teamData.id,
        })
        .then((res) => {
          console.log("Created", res);
          setButtonLoading(false);
        });
    }
    message.success("บันทึกข้อมูลทีมสำเร็จแล้ว!", 5);
  };
  const onChange = (date, dateString) => {
    console.log(dateString);
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
      if (memberId === presidentData.id) {
        message.error("ไม่สามารถลบหัวหน้ากลุ่มออกจากทีมได้");
      } else {
        axios
          .post(`${PATH_API}/users/delete/${memberId}/${authUser.uid}`)
          .then((res) => {
            console.log("Member deleted:", res);
          })
          .catch((err) => {
            console.error("Error deleting member:", err);
          });
      }
    }
  };
  const getMyTeam = async () => {
    await axios
      .get(PATH_API + `/groups/getbyid/${authUser.uid}`)
      .then((res) => {
        setTeamData(res.data);
        axios
          .get(PATH_API + `/users/getteammembers/${res.data.id}`)
          .then((res) => {
            console.log("getteammembers", res);
            const newdata = res.data.map((e) => ({
              ...e,
              Occupation: e.OccupationId,
              DateofBirth: e.DateofBirth
                ? dayjs(e.DateofBirth, "YYYY-MM-DD")
                : null,
            }));
            console.log("newdata", newdata);

            form.setFieldValue("items", newdata);
          });
      });
  };
  const getNamePrefixOptions = async () => {
    setOptionsLoading(true);
    const nameprefixdata = await axios.get(PATH_API + `/name_prefixes/get`);
    console.log("nameprefixdata", nameprefixdata.data);

    setNamePrefixOptions(nameprefixdata.data);
    setOptionsLoading(false);
  };
  const getOccupationOptions = async () => {
    setOptionsLoading(true);
    const OccupationData = await axios.get(PATH_API + `/occupations/get`);
    console.log("OccupationData", OccupationData.data);

    setOccupationOptions(OccupationData.data);
    setOptionsLoading(false);
  };
  return (
    <>
      {/* {JSON.stringify(presidentData)} */}

      {teamData ? (
        <Card>
          <h1>ข้อมูลสมาชิกในทีม</h1>
          <Form
            labelCol={{
              span: 12,
            }}
            wrapperCol={{
              span: 24,
            }}
            form={form}
            name="dynamic_form_complex"
            style={{
              maxWidth: "100%",
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
                          "id",
                        ]); // ดึง id จากฟอร์ม
                        const isPresident = presidentData
                          ? memberId === presidentData.id &&
                            presidentData.IsPresident === "Yes"
                            ? "หัวหน้าทีม"
                            : "สมาชิก"
                          : null;

                        return isPresident;
                      })()}
                      key={field.key}
                      extra={
                        <Popconfirm
                          title="คุณแน่ใจหรือไม่ว่าต้องการลบ?"
                          okText="ใช่"
                          cancelText="ไม่"
                          onConfirm={() => {
                            const memberId = form.getFieldValue([
                              "items",
                              field.name,
                              "id",
                            ]); // ดึงค่า id ของสมาชิก
                            console.log("Deleting member with ID:", memberId);

                            if (memberId) {
                              if (memberId === presidentData.id) {
                                message.error(
                                  "ไม่สามารถลบหัวหน้าออกจากทีมได้ หากต้องการเปลี่ยนแปลงกรุณาติดต่อผู้ดูแลระบบ",
                                  5
                                );
                              } else {
                                axios
                                  .post(
                                    `${PATH_API}/users/delete/${memberId}/${authUser.uid}`
                                  )
                                  .then((res) => {
                                    console.log("Member deleted:", res);
                                    message.success(
                                      "ลบข้อมูลสมาชิกออกจากทีมแล้ว",
                                      5
                                    );
                                    remove(field.name);
                                  })
                                  .catch((err) => {
                                    console.error(
                                      "Error deleting member:",
                                      err
                                    );
                                  });
                              }
                            } else if (!memberId) {
                              remove(field.name);
                            }
                          }}
                        >
                          <CloseOutlined
                            style={{ color: "red", cursor: "pointer" }}
                          />
                        </Popconfirm>
                      }
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                          <Form.Item
                            hidden="true"
                            label="id"
                            name={[field.name, "id"]}
                          >
                            <Input disabled={true} />
                          </Form.Item>
                          <Form.Item
                            label="ProfilePicture"
                            name={[field.name, "ProfilePicture"]}
                          >
                            <UploadProfilePicture />
                          </Form.Item>
                          <Form.Item
                            label="คำนำหน้า"
                            name={[field.name, "NamePrefixId"]}
                          >
                            <Select
                              style={{ width: "100%" }}
                              dropdownStyle={{ whiteSpace: "normal" }}
                              loading={optionsLoading}
                              placeholder="คำนำหน้า"
                              showSearch
                              optionFilterProp="children" // ให้ค้นหาจาก children ของ Select.Option
                              filterOption={(input, option) =>
                                String(option.children)
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                            >
                              {namePrefixOptions
                                ? namePrefixOptions.map((item) => (
                                    <Select.Option
                                      key={item.id}
                                      value={item.PrefixCode}
                                      title={`${item.PrefixName}`}
                                      style={{ whiteSpace: "normal" }}
                                    >
                                      {item.PrefixName}
                                    </Select.Option>
                                  ))
                                : null}
                            </Select>
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
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                          <Form.Item
                            label="วัน/เดือน/ปี เกิด"
                            name={[field.name, "DateofBirth"]}
                            rules={[
                              {
                                required: true,
                                message: "Please input your Email!",
                              },
                            ]}
                          >
                            <DatePicker
                              locale={thLocale}
                              disabledDate={(current) => {
                                const minDate = dayjs().subtract(15, "year"); // ต้องมีอายุ 15 ปีขึ้นไป
                                return (
                                  current && current.isAfter(minDate, "day")
                                );
                              }}
                              onChange={onChange}
                            />
                          </Form.Item>

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
                            <Select
                              style={{ width: "100%" }}
                              dropdownStyle={{ whiteSpace: "normal" }}
                              loading={optionsLoading}
                              placeholder="เลือกอาชีพ"
                              showSearch
                              optionFilterProp="children" // ให้ค้นหาจาก children ของ Select.Option
                              filterOption={(input, option) =>
                                String(option.children)
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                            >
                              {OccupationOptions
                                ? OccupationOptions.map((item) => (
                                    <Select.Option
                                      key={item.id}
                                      value={item.id}
                                    >
                                      {item.OccupationName}
                                    </Select.Option>
                                  ))
                                : null}
                            </Select>
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
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
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
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
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
                        </Col>
                      </Row>
                    </Card>
                  ))}

                  <Button type="dashed" onClick={() => add()} block>
                    + เพิ่มสมาชิก
                  </Button>
                </div>
              )}
            </Form.List>
            <Form.Item
              label={null}
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button type="primary" htmlType="submit" loading={buttonLoading}>
                บันทึกสมาชิก
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <Card>
          <Spin />

          <Skeleton active />
        </Card>
      )}
    </>
  );
};
