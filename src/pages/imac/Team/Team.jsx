import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Result,
  Row,
  Select,
  Skeleton,
} from "antd";
import { PlusOutlined, ToolOutlined } from "@ant-design/icons";
import axios from "axios";
import { authUser, EventId, ImgUrl, PATH_API } from "../../../constrant";

import { useEffect, useRef, useState } from "react";
import { TeamConsultPage } from "../../../components/TeamConsult";

export const TeamPage = () => {
  const [form] = Form.useForm();
  const dataFetchedRef = useRef(false);
  const [teamData, setTeamData] = useState();
  const [teamMemberData, setTeamMemberData] = useState();
  const [teamConsultData, setTeamConsultData] = useState();
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [competitionTypeOptions, setCompetitionTypeOptions] = useState();
  const [personTypeOptions, setPersonTypeOptions] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const getMyTeam = async () => {
    await axios
      .get(PATH_API + `/groups/getbyid/${authUser.uid}`)
      .then((res) => {
        setTeamData(res.data);
        setFormData(res.data);
        console.log("getMyTeam", res.data);

        if (res.data.id) {
          axios
            .get(
              PATH_API +
                `/consult_with_teams/getbyteam/${res.data.id}/${EventId}`
            )
            .then((data) => {
              console.log("consult_with_group", data.data);
              setTeamConsultData(data.data);
              axios
                .get(PATH_API + `/users/getteammembers/${res.data.id}`)
                .then((memdata) => {
                  console.log("teammember", memdata);
                  setTeamMemberData(memdata.data);
                });
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
    await axios
      .get(PATH_API + `/competition_types/get/${EventId}`)
      .then((res) => {
        setOptionsLoading(true);

        setCompetitionTypeOptions(res.data);
        console.log(res.data);
        setOptionsLoading(false);
      });
  };

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
    if (!authUser) {
      window.location.assign("/login");
    }
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
        style={{ border: "0px" }}
        // title={<h1>ข้อมูลทีม</h1>}
        // extra={
        //   <>
        //     {teamData ? (
        //       <Button
        //         onClick={() => {
        //           window.location.assign("/user/teamedit");
        //         }}
        //         icon={<ToolOutlined />}
        //       >
        //         แก้ไขทีม
        //       </Button>
        //     ) : (
        //       <Button
        //         onClick={() => {
        //           window.location.assign("/user/teamcreate");
        //         }}
        //         loading={optionsLoading}
        //         icon={<PlusOutlined />}
        //       >
        //         สร้างทีม
        //       </Button>
        //     )}
        //   </>
        // }
      >
        <Row justify="space-between" align="middle">
          {/* คอลัมน์สำหรับข้อความ "ข้อมูลทีม" */}
          <Col>
            <h1>ข้อมูลทีม</h1>
          </Col>

          {/* คอลัมน์สำหรับปุ่ม (ชิดขวา) */}
          <Col>
            {teamData ? (
              <Button
                onClick={() => {
                  window.location.assign("/user/teamedit");
                }}
                icon={<ToolOutlined />}
              >
                แก้ไขทีม
              </Button>
            ) : (
              <Button
                onClick={() => {
                  window.location.assign("/user/teamcreate");
                }}
                loading={optionsLoading}
                icon={<PlusOutlined />}
              >
                สร้างทีม
              </Button>
            )}
          </Col>
        </Row>

        <div style={{ display: "flex", justifyContent: "between" }}></div>

        <Form
          disabled={true}
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
        <Divider />
        <h3>ที่ปรึกษา</h3>
        {teamConsultData != 0 ? (
          teamConsultData != null ? (
            <>
              <Button
                onClick={() => {
                  window.location.assign("/user/teamconsult");
                }}
                // onClick={showModal}
                icon={<ToolOutlined />}
              >
                แก้ไขที่ปรึกษา
              </Button>
              <List
                itemLayout="horizontal"
                dataSource={teamConsultData}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar src={ImgUrl + item.user.ProfilePictureURL} />
                      }
                      title={
                        <p>
                          {item.user.FirstName} {item.user.LastName} | ตำแหน่ง :
                          {item.user.IsPresident &&
                          item.user.IsPresident === "Consult"
                            ? "ที่ปรึกษา"
                            : "ไม่ได้ระบุ"}
                        </p>
                      }
                      description={
                        <p>
                          {item.user.Email}
                          <br />
                          {item.user.Phone}
                        </p>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          ) : (
            // <Result
            //   title="ไม่พบข้อมูลที่ปรึกษาของทีม"
            //   // extra={
            //   //   <Button type="primary" key="console">
            //   //     Go Console
            //   //   </Button>
            //   // }
            // />
            <Skeleton avatar active />
          )
        ) : (
          <>
            <Button
              onClick={() => {
                window.location.assign("/user/teamconsult");
              }}
              // onClick={showModal}
              icon={<PlusOutlined />}
            >
              เพิ่มที่ปรึกษา
            </Button>

            <Result
              title="ไม่พบข้อมูลที่ปรึกษาของทีม"
              // extra={
              //   <Button type="primary" key="console">
              //     Go Console
              //   </Button>
              // }
            />
          </>
        )}
        <Divider />
        <h3>สมาชิก</h3>
        {teamMemberData != 0 ? (
          teamMemberData != null ? (
            <>
              <Button
                onClick={() => {
                  window.location.assign("/user/teammember");
                }}
                // onClick={showModal}
                icon={<ToolOutlined />}
              >
                แก้ไขสมาชิก
              </Button>
              <List
                itemLayout="horizontal"
                dataSource={teamMemberData}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={ImgUrl + item.ProfilePictureURL} />}
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
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  window.location.assign("/user/teammember");
                }}
                // onClick={showModal}
                icon={<PlusOutlined />}
              >
                เพิ่มสมาชิก
              </Button>
              <Skeleton
                avatar
                paragraph={{
                  rows: 2,
                }}
                active
              />
            </>
          )
        ) : (
          <Result title="คุณยังไม่ได้สร้างทีม" />
        )}
      </Card>

      <Modal
        title="แก้ไขที่ปรึกษา"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TeamConsultPage />
      </Modal>
    </div>
  );
};
