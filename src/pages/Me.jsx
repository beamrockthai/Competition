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
  Row,
  Select,
  Upload,
} from "antd";
import { authUser, ImgUrl, PATH_API } from "../constrant";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import buddhistEra from "dayjs/plugin/buddhistEra";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData"; // เพิ่ม plugin นี้
import thLocale from "antd/es/date-picker/locale/th_TH";
import "dayjs/locale/th";
import axios from "axios";
dayjs.extend(customParseFormat);
dayjs.extend(buddhistEra);
dayjs.extend(weekday);
dayjs.extend(localeData); // เรียกใช้ localeData
dayjs.locale("th");
export const MePage = () => {
  const dataFetchedRef = useRef(false);
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getMe();
    getNamePrefixOptions();
    getOccupationOptions();
    // getTeamMembers();
  }, []);
  const [optionsLoading, setOptionsLoading] = useState();
  const [OccupationOptions, setOccupationOptions] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [namePrefixOptions, setNamePrefixOptions] = useState();
  const getOccupationOptions = async () => {
    setOptionsLoading(true);
    const OccupationData = await axios.get(PATH_API + `/occupations/get`);
    console.log("OccupationData", OccupationData.data);

    setOccupationOptions(OccupationData.data);
    setOptionsLoading(false);
  };
  const getNamePrefixOptions = async () => {
    setOptionsLoading(true);
    const nameprefixdata = await axios.get(PATH_API + `/name_prefixes/get`);
    console.log("nameprefixdata", nameprefixdata.data);

    setNamePrefixOptions(nameprefixdata.data);
    setOptionsLoading(false);
  };
  const handleChange = (info) => {
    console.log("handleChange", info.file);

    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      const newImageUrl = ImgUrl ? info.file.response : info.file.response;
      setImageUrl(newImageUrl);

      form.setFieldValue("ProfilePictureURL", newImageUrl);
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
  const onChange = (date, dateString) => {
    console.log(dateString);
    if (date) {
      const age = dayjs().diff(date, "year"); // คำนวณอายุ
      if (age < 15) {
        message.error("คุณต้องมีอายุอย่างน้อย 15 ปีขึ้นไป!", 5);
        form.setFieldsValue({ DateofBirth: null }); // รีเซ็ตค่าในฟอร์ม
      } else {
        form.setFieldsValue({ DateofBirth: date }); // อัปเดตค่าในฟอร์ม
      }
    }
  };
  const getMe = () => {
    axios.get(PATH_API + `/users/getbyid/${authUser.uid}`).then((data) => {
      console.log("data", data);
      console.log("data.data", data.data);

      console.log("newdata", {
        ...data.data,
        DateofBirth: data.data.DateofBirth
          ? dayjs(data.data.DateofBirth, "YYYY-MM-DD")
          : null,
      });

      form.setFieldsValue({
        ...data.data,
        DateofBirth: data.data.DateofBirth
          ? dayjs(data.data.DateofBirth, "YYYY-MM-DD")
          : null,
      });
    });
  };
  const onFinish = async (values) => {
    console.log("PAONN", values);
    setButtonLoading(true);

    console.log(dayjs(values.DateofBirth, "DDMMYYYY"));
    await axios
      .post(PATH_API + "/users/create", {
        ...values,
        IsPresident: values.IsPresident ? values.IsPresident : "No",
      })
      .then((res) => {
        console.log("Created", res);
        setButtonLoading(false);
      });
    setButtonLoading(false);
    message.success("บันทึกข้อมูลทีมสำเร็จแล้ว!", 5);
  };
  return (
    <Card>
      <Form form={form} name="basic" onFinish={onFinish} autoComplete="on">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <Form.Item hidden="true" label="id" name={"id"}>
              <Input disabled={true} />
            </Form.Item>
            <Form.Item label="ProfilePicture" name={"ProfilePictureURL"}>
              <Flex gap="middle" wrap>
                <Upload
                  name="Image"
                  listType="picture-circle"
                  className="avatar-uploader"
                  showUploadList={false}
                  action={PATH_API + "/upload"}
                  beforeUpload={beforeUpload}
                  onChange={(e) => handleChange(e)}
                >
                  <Avatar
                    size={100}
                    src={ImgUrl + form.getFieldValue("ProfilePictureURL")}
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
            <Form.Item label="คำนำหน้า" name={"NamePrefixId"}>
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
              name={"FirstName"}
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
              name={"LastName"}
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
              name={"NationalId"}
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
              name={"DateofBirth"}
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
            >
              <DatePicker locale={thLocale} onChange={onChange} />
            </Form.Item>

            <Form.Item
              label="อาชีพ"
              name={"OccupationId"}
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
                      <Select.Option key={item.id} value={item.id}>
                        {item.OccupationName}
                      </Select.Option>
                    ))
                  : null}
              </Select>
            </Form.Item>

            <Form.Item
              label="สังกัดสถานศึกษา"
              name={"AffiliatedAgency"}
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
              name={"Address1"}
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
              name={"Phone"}
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
              name={"LineId"}
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
              name={"Email"}
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
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              บันทึกข้อมูล
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Card>
  );
};
