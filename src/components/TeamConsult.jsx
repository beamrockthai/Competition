import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Upload,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { authUser, EventId, ImgUrl, PATH_API } from "../constrant";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import buddhistEra from "dayjs/plugin/buddhistEra";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData"; // เพิ่ม plugin นี้
import thLocale from "antd/es/date-picker/locale/th_TH";
import "dayjs/locale/th";
// import { fs } from "fs";

dayjs.extend(customParseFormat);
dayjs.extend(buddhistEra);
dayjs.extend(weekday);
dayjs.extend(localeData); // เรียกใช้ localeData
dayjs.locale("th");
const dateFormat = "YYYY-MM-DD";
export const TeamConsultPage = () => {
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getMyTeam();
    getNamePrefixOptions();
    getOccupationOptions();
    // getTeamMembers();
  }, []);
  const dataFetchedRef = useRef(false);

  const [form] = Form.useForm();
  const [teamData, setTeamData] = useState();
  const [namePrefixOptions, setNamePrefixOptions] = useState();
  const [OccupationOptions, setOccupationOptions] = useState();
  const [optionsLoading, setOptionsLoading] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  // const [presidentData, setPresidentData] = useState();

  const handleChange = (info, name) => {
    console.log("handleChange", info.file);

    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      const newImageUrl = ImgUrl ? info.file.response : info.file.response;
      setImageUrl(newImageUrl);

      form.setFieldValue(["items", name, "ProfilePictureURL"], newImageUrl);
    }
  };

  const beforeUpload = (file) => {
    console.log("beforeUpload", file);

    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error("Image must smaller than 10MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const onFinish = async (values) => {
    console.log("Success:", values.items[0]);
    console.log("PAONN", values);
    setButtonLoading(true);

    for (var i = 0; i < values.items.length; i++) {
      console.log("ggggggg", values.items[i]);
      await axios
        .post(PATH_API + "/users/create", {
          ...values.items[i],

          IsPresident: "Consult",
          GroupId: teamData.id,
          CreatedBy: authUser.uid,
          Role: 4,
        })
        .then((res) => {
          console.log("Created//////////", res);
          if (res.status === 204) {
            setButtonLoading(false);
          } else if (res.status === 200) {
            const createdata = {
              ConsultUserId: values.items[i].id,
              GroupId: teamData.id,
              EventId: EventId,
              Status: "Active",
              CreatedBy: authUser.uid,
            };
            axios
              .post(PATH_API + `/consult_with_teams/create`, createdata)
              .then((res) => {
                console.log("/consult_with_teams/create", res);
                setButtonLoading(false);
              });
          } else if (res.status === 201) {
            const createdata = {
              ConsultUserId: res.data.id,
              GroupId: teamData.id,
              EventId: EventId,
              Status: "Active",
              CreatedBy: authUser.uid,
            };
            axios
              .post(PATH_API + `/consult_with_teams/create`, createdata)
              .then((res) => {
                console.log("/consult_with_teams/create", res);
                setButtonLoading(false);
              });
          } else {
            console.log("203", res);

            const createdata = {
              ConsultUserId: res.data.id,
              GroupId: teamData.id,
              EventId: EventId,
              Status: "Active",
              CreatedBy: authUser.uid,
            };
            axios
              .post(PATH_API + `/consult_with_teams/create`, createdata)
              .then((res) => {
                console.log("/consult_with_teams/create", res);
                setButtonLoading(false);
              });
          }

          setButtonLoading(false);
        });
    }
    message.success("บันทึกข้อมูลที่ปรึกษาทีมสำเร็จแล้ว!", 5);
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
  const onChange = (date, dateString) => {
    console.log(dateString);
    if (date) {
      const age = dayjs().diff(date, "year"); // คำนวณอายุ
      if (age < 25) {
        message.error("คุณต้องมีอายุอย่างน้อย 25 ปีขึ้นไป!", 5);
        form.setFieldsValue({ DateofBirth: null }); // รีเซ็ตค่าในฟอร์ม
      } else {
        form.setFieldsValue({ DateofBirth: date }); // อัปเดตค่าในฟอร์ม
      }
    }
  };
  const getMyTeam = async () => {
    await axios
      .get(PATH_API + `/groups/getbyid/${authUser.uid}`)
      .then((res) => {
        setTeamData(res.data);
        console.log("getMyTeamhabibi", res.data);

        axios
          .get(
            PATH_API + `/consult_with_teams/getbyteam/${res.data.id}/${EventId}`
          )
          .then((res) => {
            console.log("consult_with_group", res.data);
            const newconsultdata = res.data.map((e) => ({
              ...e.user,
              id: e.ConsultUserId,
              Occupation: e.user.OccupationId,
              DateofBirth: e.user.DateofBirth
                ? dayjs(e.user.DateofBirth, dateFormat)
                : null,
            }));
            console.log("newdata", newconsultdata);
            form.setFieldValue("items", newconsultdata);
          });
        // axios
        //   .get(PATH_API + `/users/getteamconsult/${res.data.id}`)
        //   .then((res) => {
        //     console.log("getteamconsult", res);
        //     const newconsultdata = res.data.map((e) => ({
        //       ...e,
        //       Occupation: e.OccupationId,
        //       DateofBirth: e.DateofBirth
        //         ? dayjs(e.DateofBirth, dateFormat)
        //         : null,
        //     }));
        //     console.log("newdata", newconsultdata);
        //     form.setFieldValue("items", newconsultdata);
        //   });
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
      {teamData ? (
        <div className="cardbody">
          <h1>ข้อมูลที่ปรึกษา/อาจารย์ของทีม</h1>
          <Form
            labelCol={{
              span: 12,
            }}
            wrapperCol={{ span: 24 }}
            form={form}
            name="consult_form"
            style={{
              MaxWidth: "100%",
            }}
            autoComplete="off"
            initialValues={{
              items: [{}],
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="horizontal"
          >
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <div
                // style={{
                //   display: "flex",
                //   rowGap: 16,
                //   flexDirection: "column",
                // }}
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
                              console.log(memberId);

                              axios
                                .post(
                                  `${PATH_API}/consult_with_teams/delete/${memberId}/${teamData.id}/${authUser.uid}`
                                )
                                .then((res) => {
                                  console.log("Member deleted:", res);
                                  remove(field.name); // ลบฟอร์มของสมาชิกออกจาก UI
                                  message.success(
                                    "ลบข้อมูลที่ปรึกษาออกจากทีมแล้ว",
                                    5
                                  );
                                })
                                .catch((err) => {
                                  console.error("Error deleting member:", err);
                                });
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
                            label="id"
                            name={[field.name, "id"]}
                            hidden={true}
                          >
                            <Input disabled />
                          </Form.Item>
                          <Form.Item
                            label="ProfilePicture"
                            name={[field.name, "ProfilePicture"]}
                          >
                            <Flex gap="middle" wrap>
                              <Upload
                                name="Image"
                                listType="picture-circle"
                                className="avatar-uploader"
                                showUploadList={false}
                                action={PATH_API + "/upload"}
                                beforeUpload={beforeUpload}
                                onChange={(e) => handleChange(e, field.name)}
                              >
                                <Avatar
                                  size={100}
                                  src={
                                    ImgUrl +
                                    form.getFieldValue([
                                      "items",
                                      field.name,
                                      "ProfilePictureURL",
                                    ])
                                  }
                                  alt="avatar"
                                  className="profile-avatar"
                                  // style={{
                                  //   width: "100%",

                                  // objectFit: "cover", // ป้องกันการบิดเบี้ยว
                                  // }}
                                />
                              </Upload>
                            </Flex>
                            {/* <UploadProfilePicture /> */}
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
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                          <Form.Item
                            label="ชื่อ"
                            name={[field.name, "FirstName"]}
                            rules={[
                              { required: true, message: "กรุณากรอกชื่อ!" },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                          <Form.Item
                            label="นามสกุล"
                            name={[field.name, "LastName"]}
                            rules={[
                              { required: true, message: "กรุณากรอกนามสกุล!" },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                          <Form.Item
                            label="เลขบัตรประชาชน"
                            name={[field.name, "NationalId"]}
                            rules={[
                              {
                                required: true,
                                message: "กรุณากรอกเลขบัตรประชาชน!",
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
                            <DatePicker locale={thLocale} onChange={onChange} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                          <Form.Item
                            label="สังกัดสถานศึกษา"
                            name={[field.name, "AffiliatedAgency"]}
                            rules={[
                              {
                                required: true,
                                message: "กรุณากรอกสังกัดสถานศึกษา!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            label="อาชีพ"
                            name={[field.name, "Occupation"]}
                            rules={[
                              { required: true, message: "กรุณากรอกอาชีพ!" },
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
                        </Col>
                      </Row>

                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                          <Form.Item
                            label="ที่อยู่ปัจจุบัน"
                            name={[field.name, "Address1"]}
                            rules={[
                              {
                                required: true,
                                message: "กรุณากรอกที่อยู่ปัจจุบัน!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                          <Form.Item
                            label="เบอร์ติดต่อ"
                            name={[field.name, "Phone"]}
                            rules={[
                              {
                                required: true,
                                message: "กรุณากรอกเบอร์ติดต่อ!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                          <Form.Item
                            label="Line ID"
                            name={[field.name, "LineId"]}
                            rules={[
                              { required: true, message: "กรุณากรอก Line ID!" },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                          <Form.Item
                            label="Email"
                            name={[field.name, "Email"]}
                            rules={[
                              { required: true, message: "กรุณากรอกอีเมล!" },
                            ]}
                          >
                            <Input type="email" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  {fields.length === 0 && (
                    <Button type="dashed" onClick={() => add()} block>
                      + เพิ่มที่ปรึกษา / อาจารย์
                    </Button>
                  )}
                </div>
              )}
            </Form.List>

            <Form.Item
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button type="primary" htmlType="submit" loading={buttonLoading}>
                บันทึกที่ปรึกษา
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <Card>
          <h1>ข้อมูลที่ปรึกษา/อาจารย์ของทีม</h1>
          <Spin />

          <Skeleton active />
        </Card>
      )}
    </>
  );
};
