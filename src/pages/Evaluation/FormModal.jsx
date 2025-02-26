import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  Typography,
  Card,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { addForm, updateForm } from "../../services/evaluation";
import axios from "axios";
import { PATH_API } from "../../constrant";

const FormModal = ({ visible, onClose, onFormSaved, editingForm }) => {
  const [form] = Form.useForm();
  const [formName, setFormName] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [evaluations, setEvaluations] = useState([
    { id: Date.now(), label: "" },
  ]);

  useEffect(() => {
    if (editingForm) {
      // setFormName(editingForm.name);
      // setCriteria(editingForm.criteria || []);
      // setEvaluations(
      //   editingForm.evaluations || [{ id: Date.now(), label: "" }]
      // );
      getEvaluationForm(editingForm.id);
      getFormData(editingForm.id);
      console.log(editingForm.id);
    } else {
      resetFormState();
    }
  }, [editingForm]);
  const getFormData = async (id) => {
    const data = await axios.get(
      PATH_API + `/evaluation_questions/getbyform/${id}`
    );
    console.log(data);

    form.setFieldValue("Criteria", data.data);
  };
  const getEvaluationForm = async (id) => {
    const data = await axios.get(PATH_API + `/evaluation_forms/getbyid/${id}`);
    console.log(data);

    form.setFieldsValue(data.data);
  };
  const resetFormState = () => {
    setFormName("");
    setCriteria([]);
    setEvaluations([{ id: Date.now(), label: "" }]);
  };

  // const handleSaveForm = async () => {
  //   console.log("vallll");

  //   onFinish();
  // if (!formName.trim() || criteria.length === 0 || evaluations.length === 0)
  //   return;

  // const newForm = { name: formName, criteria, evaluations };
  // if (editingForm) {
  //   // await updateForm(editingForm.id, newForm);
  //   console.log("editingForm", editingForm);
  // } else {
  //   console.log("newForm", newForm);
  //   for (var i = 0; i < newForm.criteria.length; i++) {
  //     console.log(newForm.criteria[i]);
  //   }

  //   // await addForm(newForm);
  // }
  // onFormSaved();
  // // onClose();
  // };

  const onFinish = async (values) => {
    console.log("Received values of form:", values);
    axios
      .post(PATH_API + `/evaluation_forms/create`, {
        id: values.id,
        Name: values.Name,
      })
      .then((res) => {
        for (var i = 0; i < values.Criteria.length; i++) {
          console.log(values.Criteria[i]);
          const id = res.data[1];
          axios
            .post(PATH_API + `/evaluation_questions/create`, {
              ...values.Criteria[i],
              EvaluationFormId: res.data.id ? res.data.id : id[0].id,
              CreatedBy: null,
              Status: "Active",
            })
            .then((res) => {
              console.log(res);
            });
        }
        // onFormSaved();
        // onClose();
      });
  };
  const confirmDelete = (name, remove) => {
    const memberId = form.getFieldValue(["Criteria", name, "id"]); // ดึงค่า ID

    console.log("Deleting member with ID:", memberId);

    if (memberId) {
      axios
        .post(`${PATH_API}/evaluation_questions/delete/${memberId}`)
        .then((res) => {
          console.log("Deleted successfully:", res);
          remove(name); // ลบออกจาก UI หลังจากลบ API สำเร็จ
        })
        .catch((err) => {
          console.error("Error deleting member:", err);
        });
    } else {
      remove(name); // ถ้าไม่มี ID ก็ลบแค่ใน UI
    }
  };

  return (
    <Modal
      title={editingForm ? "แก้ไขแบบฟอร์ม" : "สร้างแบบฟอร์ม"}
      open={visible}
      onCancel={onClose}
      // onOk={handleSaveForm}
      okText="บันทึก"
      cancelText="ยกเลิก"
    >
      <Form layout="vertical" form={form} name="Form" onFinish={onFinish}>
        {/* <Form.Item label="เกณฑ์">
          <Space direction="vertical" style={{ width: "100%" }}>
            {criteria.map((criterion, index) => (
              <Space key={criterion.id} style={{ width: "100%" }}>
                <Input
                  placeholder={`แถวที่ ${index + 1}`}
                  value={criterion.name}
                  onChange={(e) => {
                    const newCriteria = [...criteria];
                    newCriteria[index].name = e.target.value;
                    setCriteria(newCriteria);
                  }}
                  style={{ flex: 1 }}
                />

                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    setCriteria(criteria.filter((c) => c.id !== criterion.id))
                  }
                >
                  ลบ
                </Button>
              </Space>
            ))}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                setCriteria([...criteria, { id: Date.now(), name: "" }])
              }
            >
              เพิ่มแถว
            </Button>
          </Space>
        </Form.Item> */}

        {/* <Form.Item label="ระดับการประเมิน (สูงสุด 5 ระดับ)">
          <Space direction="vertical" style={{ width: "100%" }}>
            {evaluations.map((evaluation, index) => (
              <Space key={evaluation.id} style={{ width: "100%" }}>
                <Input
                  placeholder={`ระดับที่ ${index + 1}`}
                  value={evaluation.label}
                  onChange={(e) => {
                    const newEvaluations = [...evaluations];
                    newEvaluations[index].label = e.target.value;
                    setEvaluations(newEvaluations);
                  }}
                  style={{ flex: 1 }}
                />
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    setEvaluations(
                      evaluations.filter((ev) => ev.id !== evaluation.id)
                    )
                  }
                  disabled={evaluations.length <= 1}
                >
                  ลบ
                </Button>
              </Space>
            ))}
            {evaluations.length < 5 && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() =>
                  setEvaluations([
                    ...evaluations,
                    { id: Date.now(), label: "" },
                  ])
                }
              >
                เพิ่มระดับ
              </Button>
            )}
          </Space>
        </Form.Item> */}
        <Form.Item name="id" hidden={true}></Form.Item>
        <Form.Item name="Name" label="ชื่อแบบฟอร์ม">
          <Input
            // value={formName}
            // onChange={(e) => setFormName(e.target.value)}
            placeholder="ใส่ชื่อแบบฟอร์ม"
          />
        </Form.Item>
        <Form.List name="Criteria">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <>
                  <Card
                    title={(() => {
                      const memberId = form.getFieldValue([
                        "Criteria",
                        fields.name,
                        "id",
                      ]);

                      return memberId ? memberId : `คำถาม`;
                    })()}
                    key={fields.key}
                  >
                    <Space
                      key={key}
                      style={{
                        display: "flex",
                        marginBottom: 8,
                      }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        label="Question"
                        name={[name, "Question"]}
                        rules={[
                          {
                            required: true,
                            message: "Missing first name",
                          },
                        ]}
                      >
                        <Input placeholder="Questions" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="MaxScore"
                        name={[name, "MaxScore"]}
                        rules={[
                          {
                            required: true,
                            message: "Missing last name",
                          },
                        ]}
                      >
                        <Input type="number" placeholder="MaxScore" />
                      </Form.Item>
                      {/* <MinusCircleOutlined
                        onClick={() => {
                          console.log([fields.name, "id"]);

                          confirm(name);
                          // <Popconfirm
                          //   title="Delete the task"
                          //   description="Are you sure to delete this task?"
                          //   onConfirm={confirm}
                          //   onCancel={cancel}
                          //   okText="Yes"
                          //   cancelText="No"
                          // >
                          //   <Button danger>Delete</Button>
                          // </Popconfirm>;
                          // remove(name);
                          // remove(field.name); // ลบฟอร์มของสมาชิกออกจาก UI
                        }}
                      /> */}
                      <Popconfirm
                        title="คุณแน่ใจหรือไม่ที่จะลบคำถามนี้?"
                        okText="ใช่"
                        cancelText="ยกเลิก"
                        onConfirm={() => confirmDelete(name, remove)}
                      >
                        <MinusCircleOutlined style={{ color: "red" }} />
                      </Popconfirm>
                    </Space>
                  </Card>
                </>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add field
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormModal;
