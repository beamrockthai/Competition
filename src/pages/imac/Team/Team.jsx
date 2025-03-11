import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  List,
  Result,
  Row,
  Select,
  Skeleton,
} from "antd";
import axios from "axios";
import { authUser, PATH_API } from "../../../constrant";

import { useEffect, useRef, useState } from "react";


export const TeamPage = () => {
  const [form] = Form.useForm();
  const dataFetchedRef = useRef(false);
  const [teamData, setTeamData] = useState();
  const [teamMemberData, setTeamMemberData] = useState();
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [competitionTypeOptions, setCompetitionTypeOptions] = useState();
  const [personTypeOptions, setPersonTypeOptions] = useState();

  const getMyTeam = async () => {
    await axios
      .get(PATH_API + `/groups/getbyid/${authUser.uid}`)
      .then((res) => {
        setTeamData(res.data);
        setFormData(res.data);
        if (res.data.id) {
          axios
            .get(PATH_API + `/users/getteammembers/${res.data.id}`)
            .then((res) => {
              console.log("teammember", res);
              setTeamMemberData(res.data);
              // for (var i = 0; i < res.data.length; i++) {
              //   form.setFieldsValue({
              //     FirstName: res.data[i].FirstName,
              //     LastName: res.data[i].LastName,
              //     NationalId: res.data[i].NationalId,
              //     DateofBirth: res.data[i].DateofBirth,
              //     Occupation: res.data[i].Occupation,
              //     AffiliatedAgency: res.data[i].AffiliatedAgency,
              //     Address1: res.data[i].Address1,
              //     Address2: res.data[i].Address2,
              //     AddressSubDistrict: res.data[i].AddressSubDistrict,
              //     AddressDistrict: res.data[i].AddressDistrict,
              //     AddressProvince: res.data[i].AddressProvince,
              //     PostCode: res.data[i].PostCode,
              //     Phone: res.data[i].Phone,
              //     Email: res.data[i].Email,
              //     LineId: res.data[i].LineId,
              //   });
              // }
            });
        } else {
          setTeamMemberData(0);
        }
      });
  };
  const getPersontypeOptions = async () => {
    await axios.get(PATH_API + "/person_types/get").then((res) => {
      setOptionsLoading(true);

      setPersonTypeOptions(res.data);
      console.log(res.data);
      setOptionsLoading(false);
    });
  };
  const getCompetitionType = async () => {
    await axios.get(PATH_API + "/competition_types/get").then((res) => {
      setOptionsLoading(true);

      setCompetitionTypeOptions(res.data);
      console.log(res.data);
      setOptionsLoading(false);
    });
  };
  const data = [
    {
      title: `kk`,
    },
    {
      title: "Ant Design Title 2",
    },
    {
      title: "Ant Design Title 3",
    },
    {
      title: "Ant Design Title 4",
    },
  ];
  const onFinish = async (values) => {
    console.log("Success:", values);

    axios
      .post(PATH_API + "/users/update", { ...values, id: authUser.uid })
      .then((res) => {
        console.log("Created", res);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  //   const onPersonTypeChange = (e) => {
  //     setValue(e.target.value);
  //   };
  const setFormData = async (a) => {
    form.setFieldsValue({
      TeamName: a.TeamName,
      PersonType: a.PersonTypeId,
      CompetitionType: a.CompetitionType,
    });
  };
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getMyTeam();
    getCompetitionType();
    getPersontypeOptions();
  }, []);
  return (
    <div className="body">
      <h1>Team Page</h1>
      <Card
        title={<h1>ข้อมูลทีม</h1>}
        extra={
          <>
            {teamData ? (
              <Button
                onClick={() => {
                  window.location.assign("/teamedit");
                }}
              >
                แก้ไขทีม
              </Button>
            ) : (
              <Button
                onClick={() => {
                  window.location.assign("/teamcreate");
                }}
              >
                สร้างทีม
              </Button>
            )}
          </>
        }
      >
        <Form
          disabled={true}
          form={form}
          layout="horizontal"
          name="basic"
          labelCol={{
            span: 8,
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
                name="PersonType"
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
        </Form>
        {teamMemberData != 0 ? (
          teamMemberData != null ? (
            <List
              itemLayout="horizontal"
              dataSource={teamMemberData}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                      />
                    }
                    title={
                      <p>
                        {item.FirstName} {item.LastName} | ตำแหน่ง :
                        {item.IsPresident && item.IsPresident === "Yes"
                          ? "หัวหน้ากลุ่ม"
                          : "สมาชิกกลุ่ม"}
                      </p>
                    }
                    description={
                      <p>
                        {item.Email}
                        <br />
                        {item.Phone}
                      </p>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Skeleton
              avatar
              paragraph={{
                rows: 2,
              }}
            />
          )
        ) : (
          <Result title="คุณยังไม่ได้สร้างทีม" />
        )}
      </Card>
    </div>
  );
};
