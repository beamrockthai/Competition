import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Modal,
  message,
  Popconfirm,
  Table,
  Space,
  Select,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

// import { useUserAuth } from "../../Context/UserAuth";
// import {
//   loadDirectors,
//   addDirector,
//   deleteDirector,
// } from "../../services/directorFunctions";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/TableComponent";
import axios from "axios";
import { PATH_API } from "../../constrant";

export const ManageDirectorsPage = () => {
  // const { signUpDirector } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [directors, setDirectors] = useState([]);
  const [passwords, setPasswords] = useState({});
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(null); // ✅ เก็บค่าฟอร์มก่อนสมัคร
  const [data, setData] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    // loadDirectors(setDirectors);
    getUserDirector();
    getUserNotDirector();
  }, []);
  const getUserDirector = async () => {
    const data = await axios.get(PATH_API + `/users/getbyrole/3`);
    console.log(data);
    setDirectors(data.data);
  };
  const getUserNotDirector = async () => {
    setOptionsLoading(true);
    const data = await axios.get(PATH_API + `/users/getnotdirector`);
    console.log(data);
    setData(data.data);
    setOptionsLoading(false);
  };
  // ✅ เปิด Popup ยืนยันก่อนสมัคร
  const showConfirmModal = (values) => {
    console.log("showConfirmModal", values.director[0].Director);
    for (var i = 0; i < values.director.length; i++) {
      axios.patch(PATH_API + `/users/update`, {
        Role: 3,
        id: values.director[i].Director,
      });
    }

    setFormValues(values);
    setIsConfirmModalOpen(false);
  };

  // ✅ ยืนยันสมัครกรรมการ
  const handleConfirmRegister = async () => {
    setLoading(true);
    setIsConfirmModalOpen(false); // ✅ ปิด popup ยืนยัน

    // try {
    //   await addDirector(
    //     formValues,
    //     signUpDirector,
    //     setPasswords,
    //     setDirectors,
    //     form
    //   );
    //   message.success("กรรมการถูกเพิ่มเรียบร้อยแล้ว");
    //   setIsModalOpen(false);
    //   form.resetFields();
    //   navigate("/manage-directors");
    // } catch (error) {
    //   message.error("เกิดข้อผิดพลาดในการเพิ่มกรรมการ");
    // } finally {
    //   setLoading(false);
    // }
  };
  const deleteDirector = (values) => {
    console.log("deleteDirector", values);

    axios.patch(PATH_API + `/users/update`, { Role: "4", id: values });
    getUserDirector();
  };
  return (
    <div style={{ padding: "20px" }}>
      {/* Header Section */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <Col>
          <h2 style={{ margin: 0 }}>จัดการกรรมการ</h2>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: "#b12341", borderColor: "#b12341" }}
          >
            เพิ่มกรรมการ
          </Button>
        </Col>
      </Row>

      {/* TableComponent */}
      <Table
        columns={[
          { title: "First Name", dataIndex: "FirstName" },
          { title: "Last Name", dataIndex: "LastName" },
          { title: "ID Card", dataIndex: "NationalId" },
          { title: "Address", dataIndex: "Address1" },
          { title: "Email", dataIndex: "Email" },
          { title: "Role", dataIndex: "Role" },
          {
            title: "Password",
            dataIndex: "email",
            render: (email) => passwords[email] || "N/A",
          },
          {
            title: "Actions",
            dataIndex: "id",
            render: (id) => (
              <Popconfirm
                title="คุณแน่ใจหรือไม่ว่าต้องการลบ ?"
                onConfirm={() => deleteDirector(id)}
              >
                <Button danger>ลบ</Button>
              </Popconfirm>
            ),
          },
        ]}
        dataSource={directors}
        bordered={true}
        loading={loading}
        // pagination={{ pageSize: 5 }}
        rowKey="id"
        onRowClick={(record) => console.log(record)}
      />

      {/* Modal for Adding Director */}
      <Modal
        title="เพิ่มกรรมการ"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={showConfirmModal} form={form}>
          <Form.List name="director">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      layout="horizontal"
                      {...restField}
                      label={"กรรมการ"}
                      name={[name, "Director"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing first name",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Director"
                        style={{ width: "100%" }}
                        dropdownStyle={{ whiteSpace: "normal" }}
                        loading={optionsLoading}
                        showSearch
                        optionFilterProp="children" // ให้ค้นหาจาก children ของ Select.Option
                        filterOption={(input, option) =>
                          String(option.children)
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {data.map((e) => (
                          <Select.Option key={e.id} value={e.id}>
                            {e.FirstName} {e.LastName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    เพิ่ม
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Button type="primary" htmlType="submit" block loading={loading}>
            เพิ่มกรรมการ
          </Button>
        </Form>
      </Modal>

      {/* ✅ Modal Popup ยืนยันการสมัคร */}
      {/* <Modal
        title="ยืนยันข้อมูล"
        open={isConfirmModalOpen}
        onOk={handleConfirmRegister}
        onCancel={() => setIsConfirmModalOpen(false)}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>โปรดตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยันการเพิ่มกรรมการ</p>
        <ul>
          <li>
            <b>ชื่อ:</b> {formValues?.FirstName} {formValues?.LastName}
          </li>
          <li>
            <b>บัตรประชาชน:</b> {formValues?.NationalId}
          </li>
          <li>
            <b>ที่อยู่:</b> {formValues?.Address1}
          </li>
          <li>
            <b>อีเมล:</b> {formValues?.Email}
          </li>
        </ul>
      </Modal> */}
    </div>
  );
};
