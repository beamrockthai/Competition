import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Space,
  Steps,
} from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { authUser, EventId, PATH_API } from "../../../constrant";
import { TeamMemberPage } from "../../../components/TeamMember";
import { TeamConsultPage } from "../../../components/TeamConsult";

export const TeamEditPage = () => {
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getMyTeam();
    getPersontypeOptions();
    getCompetitionType();
  }, []);
  //   const [value, setValue] = useState(1);
  const [form] = Form.useForm();

  const dataFetchedRef = useRef(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [competitionTypeOptions, setCompetitionTypeOptions] = useState();
  const [presidentData, setPresidentData] = useState();
  const [personTypeOptions, setPersonTypeOptions] = useState();
  const [teamData, setTeamData] = useState();
  const [loading, setLoading] = useState();

  const getPersontypeOptions = () => {
    axios.get(PATH_API + "/person_types/get").then((res) => {
      setOptionsLoading(true);

      setPersonTypeOptions(res.data);
      console.log(res.data);
      setOptionsLoading(false);
    });
  };
  const getCompetitionType = () => {
    axios.get(PATH_API + `/competition_types/get/${EventId}`).then((res) => {
      setOptionsLoading(true);

      setCompetitionTypeOptions(res.data);
      console.log(res.data);
      setOptionsLoading(false);
    });
  };
  const getMyTeam = async () => {
    await axios
      .get(PATH_API + `/groups/getbyid/${authUser.uid}`)
      .then((res) => {
        setTeamData(res.data);
        setFormData(res.data);
        console.log("myteam", res.data);
        axios
          .get(PATH_API + `/users/getbyid/${res.data.CreatedBy}`)
          .then((res) => {
            setPresidentData(res.data);
            setPresidentFormData(res.data);
            console.log(res.data);
          });
      });
  };
  const onFinish = async (values) => {
    setLoading(true);
    console.log("Success:", values);

    axios
      .patch(PATH_API + "/groups/update", {
        ...values,
        UpdatedBy: authUser.uid,
      })
      .then((res) => {
        console.log("Created", res);
        setLoading(false);
        message.success("บันทึกข้อมูลทีมสำเร็จแล้ว!");
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  //   const onPersonTypeChange = (e) => {
  //     setValue(e.target.value);
  //   };
  const setFormData = async (a) => {
    console.log("setFormData", a);

    form.setFieldsValue(a);
  };
  const setPresidentFormData = (a) => {
    console.log("a", a);

    form.setFieldsValue({
      FirstName: a.FirstName || null,
      LastName: a.LastName || null,
      NationalId: a.NationalId || null,
      // DateofBirth: a.DateofBirth || null,
      Occupation: a.Occupation || null,
      AffiliatedAgency: a.AffiliatedAgency || null,
      Address1: a.Address1 || null,
      Address2: a.Address2 || null,
      AddressSubDistrict: a.AddressSubDistrict || null,
      AddressDistrict: a.AddressDistrict || null,
      AddressProvince: a.AddressProvince || null,
      Postcode: a.Postcode || null,
      Phone: a.Phone || null,
      Email: a.Email || null,
      LineId: a.LineId || null,
    });
  };

  const [current, setCurrent] = useState(0);
  const onChange = (value) => {
    console.log("onChange:", value);
    setCurrent(value);
  };
  const description = "This is a description.";
  return (
    <div className="body">
      <Card>
        <h1 style={{ color: "white" }}>ข้อมูลทีม</h1>
        <Form
          form={form}
          layout="vertical"
          name="basic"
          labelCol={{
            span: 16,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: "100%",
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item name="id" hidden={true}>
            <Input />
          </Form.Item>
          <Row>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Form.Item
                label="ชื่อทีม"
                name="TeamName"
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
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Form.Item
                label="ประเภทบุคคล"
                name="PersonTypeId"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Select
                  loading={optionsLoading}
                  placeholder="เลือกประเภทบุคคล"
                  showSearch
                >
                  {personTypeOptions
                    ? personTypeOptions.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.PersonTypeName}
                        </Select.Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Form.Item
                label="ประเภทแข่งขัน"
                name="CompetitionType"
                rules={[
                  {
                    required: true,
                    message: "Please input your Email!",
                  },
                ]}
              >
                <Select
                  loading={optionsLoading}
                  placeholder="เลือกประเภทสื่อ"
                  showSearch
                >
                  {competitionTypeOptions
                    ? competitionTypeOptions.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.CompetitionTypeName}
                        </Select.Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {" "}
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              {" "}
              <Form.Item
                label="เบอร์โทรติดต่อผู้ประสานงาน"
                name="Phone"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกเบอร์โทรติดต่อผู้ประสานงาน",
                  },
                ]}
              >
                <Input
                  type="numeric"
                  placeholder="เบอร์โทรติดต่อผู้ประสานงาน"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Form.Item
                label="ชื่อผลงาน"
                name="WorkName"
                rules={[
                  {
                    required: true,
                    message: "กรุณาระบบชื่อผลงานที่สมัคร",
                  },
                ]}
              >
                <Input placeholder="ระบุชื่อผลงานที่สมัคร" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              {" "}
              <Form.Item
                label="โปรแกรมหรือเครื่องมือที่ใช้"
                name="ProgramUsed"
                rules={[
                  {
                    required: true,
                    message: "กรุณาระบุเครื่องมือที่ใช้",
                  },
                ]}
              >
                <Input placeholder="ระบุโปรแกรมหรือเครื่องมือที่ใช้ในการสร้างสรรค์ผลงาน" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={16} lg={16} xl={16}>
              {" "}
              <Form.Item
                label="แนวคิดในการสร้างสรรค์"
                name="IdeaCreate"
                rules={[
                  {
                    required: true,
                    message: "กรุณาระบุแนวคิดในการสร้างสรรค์ผลงาน",
                  },
                ]}
              >
                <Input.TextArea placeholder="ระบุชื่อแนวคิดในการสร้างสรรค์ผลงานที่ส่งแข่งขัน" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button type="primary" htmlType="submit" loading={loading}>
              บันทึกข้อมูลทีม
            </Button>
          </Form.Item>
        </Form>
        {/* <Divider />
        <TeamConsultPage />
        <Divider />
        <TeamMemberPage data={presidentData} /> */}
      </Card>
    </div>
  );
};
