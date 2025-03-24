import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
} from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { PATH_API, authUser } from "../../../constrant";
import { convertLegacyProps } from "antd/es/button";

export const TeamCreatePage = () => {
  const dataFetchedRef = useRef(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [personTypeOptions, setPersonTypeOptions] = useState();
  const [competitionTypeOptions, setCompetitionTypeOptions] = useState();
  const getPersontypeOptions = () => {
    axios.get(PATH_API + "/person_types/get").then((res) => {
      setOptionsLoading(true);

      setPersonTypeOptions(res.data);
      console.log(res.data);
      setOptionsLoading(false);
    });
  };
  const onCreateTeamStep1 = (values) => {
    const data = { ...values, CreatedBy: authUser.uid };
    console.log("onCreateTeamStep1", data);

    axios.post(PATH_API + "/groups/create", data).then((res) => {
      console.log(res);

      if (res.status === 409) {
        window.alert("Duplicate");
      } else {
        axios
          .patch(PATH_API + `/users/update`, {
            id: authUser.uid,
            GroupId: res.data.id,
            IsPresident: "Yes",
          })
          .then((res) => {
            console.log("updateuserwhencreate", res);

            window.location = "/user/teamsteps";
          });
        console.log("gggggggggggggggs", res.data);
      }
    });
  };
  const getCompetitionType = () => {
    axios.get(PATH_API + "/competition_types/get").then((res) => {
      setOptionsLoading(true);

      setCompetitionTypeOptions(res.data);
      console.log(res.data);
      setOptionsLoading(false);
    });
  };
  const onFinish = (values) => {
    console.log("Success:", values);
    onCreateTeamStep1(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getCompetitionType();
    getPersontypeOptions();
  }, []);
  return (
    <div className="body">
      <Row>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <h1>Create New Team</h1>
          {/* <h4>
            Already registered? <a href="/userlogin">Login</a>
          </h4> */}
          <Divider />
        </Col>

        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Card>
            <h1>Team</h1>
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
                label="ชื่อทีม"
                name="TeamName"
                rules={[
                  {
                    required: true,
                    message: "กรุณาระบุชื่อทีม",
                  },
                ]}
              >
                <Input placeholder="ระบุชื่อทีม" />
              </Form.Item>

              <Form.Item
                label="เลือกประเภทสื่อ"
                name="CompetitionType"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกประเภทการแข่งขัน",
                  },
                ]}
              >
                <Select
                  loading={optionsLoading}
                  placeholder="ประเภทการแข่งขัน"
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
              <Form.Item
                label="ประเภททีม"
                name="PersonType"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกประเภททีม",
                  },
                ]}
              >
                <Select
                  loading={optionsLoading}
                  placeholder="เลือกประเภททีม"
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
              <Form.Item
                name="Agreement"
                label={"ยินยอม"}
                valuePropName="checked"
                rules={[
                  {
                    required: true,
                    message: "กรุณากดยินยอม PDPA",
                  },
                ]}
              >
                <Checkbox>
                  ข้าพเจ้าขอรับรองว่าเป็นผลงานการออกแบบและจัดทำด้วยตนเอง
                  มิได้ลอกเลียนแบบ หรือดัดแปลงจากผลงานผู้อื่นแต่อย่างใด
                  พร้อมยินดีปฏิบัติตามเงื่อนไขการประกวดทุกประการ
                  และขอรับรองว่าข้อมูลที่ระบุข้างต้นเป็นความจริง
                  และยินยอมให้ผู้ควบคุมข้อมูลส่วนบุคคลกระทำการเก็บข้อมูล
                  นำไปใช้ในการจัดกิจกรรมดังกล่าว
                </Checkbox>
              </Form.Item>
              <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
