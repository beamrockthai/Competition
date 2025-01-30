import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Form, Table, Space, Radio } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  fetchForms,
  addForm,
  updateForm,
  deleteForm,
} from "../../services/evaluation";

export const Evaluation = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formName, setFormName] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [evaluations, setEvaluations] = useState([
    { id: Date.now(), label: "" },
  ]);
  const [forms, setForms] = useState([]);
  const [editingForm, setEditingForm] = useState(null);
  const [evaluationModalVisible, setEvaluationModalVisible] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [evaluationResults, setEvaluationResults] = useState({});

  // Load forms from Firebase
  useEffect(() => {
    const loadForms = async () => {
      const fetchedForms = await fetchForms();
      setForms(fetchedForms);
    };
    loadForms();
  }, []);

  const handleAddEvaluation = () => {
    if (evaluations.length < 5) {
      setEvaluations([...evaluations, { id: Date.now(), label: "" }]);
    }
  };

  const handleDeleteEvaluation = (id) => {
    setEvaluations(evaluations.filter((evaluation) => evaluation.id !== id));
  };

  const handleSaveForm = async () => {
    if (formName.trim() && criteria.length > 0 && evaluations.length > 0) {
      const newForm = { name: formName, criteria, evaluations };
      if (editingForm) {
        // Update form
        await updateForm(editingForm, newForm);
      } else {
        // Add new form
        await addForm(newForm);
      }
      resetFormState();
      const fetchedForms = await fetchForms();
      setForms(fetchedForms);
    }
  };

  const handleEditForm = (form) => {
    setFormName(form.name);
    setCriteria(form.criteria || []); // ป้องกัน undefined
    setEvaluations(form.evaluations || []); // ป้องกัน undefined
    setEditingForm(form.id); // เก็บ id ของฟอร์มที่กำลังแก้ไข
    setIsModalVisible(true);
  };

  const handleDeleteForm = async (id) => {
    try {
      await deleteForm(id);
      const fetchedForms = await fetchForms(); // ดึงข้อมูลใหม่หลังลบ
      setForms(fetchedForms);
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  const resetFormState = () => {
    setFormName("");
    setCriteria([]);
    setEvaluations([{ id: Date.now(), label: "" }]);
    setEditingForm(null);
    setIsModalVisible(false);
  };

  const handleEvaluateForm = (form) => {
    setSelectedForm(form);

    const initialResults = {};
    form.criteria.forEach((criterion) => {
      initialResults[criterion.id] = null;
    });
    setEvaluationResults(initialResults);

    setEvaluationModalVisible(true);
  };

  const handleSaveEvaluation = () => {
    console.log("Results saved:", evaluationResults);
    setEvaluationModalVisible(false);
  };

  const columns = [
    {
      title: "ชื่อแบบฟอร์ม",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "การจัดการ",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEditForm(record)}>
            แก้ไข
          </Button>
          <Button danger onClick={() => handleDeleteForm(record.id)}>
            ลบ
          </Button>
          <Button type="default" onClick={() => handleEvaluateForm(record)}>
            ประเมิน
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>แบบประเมินการแข่งขัน</h2>

      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: "20px" }}
      >
        สร้างแบบประเมิน
      </Button>

      <Table
        dataSource={forms.map((form) => ({ ...form, key: form.id }))}
        columns={columns}
        pagination={false}
      />

      <Modal
        title={editingForm ? "แก้ไขแบบฟอร์ม" : "สร้างแบบฟอร์ม"}
        open={isModalVisible}
        onCancel={resetFormState}
        onOk={handleSaveForm}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <Form layout="vertical">
          <Form.Item label="ชื่อแบบฟอร์ม">
            <Input
              placeholder="ใส่ชื่อแบบฟอร์ม"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="เกณฑ์">
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
          </Form.Item>

          <Form.Item label="ระดับการประเมิน (สูงสุด 5 ระดับ)">
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
                    onClick={() => handleDeleteEvaluation(evaluation.id)}
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
                  onClick={handleAddEvaluation}
                >
                  เพิ่มระดับ
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`ประเมินแบบฟอร์ม: ${selectedForm?.name || ""}`}
        open={evaluationModalVisible}
        onCancel={() => setEvaluationModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEvaluationModalVisible(false)}>
            ยกเลิก
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleSaveEvaluation}
            disabled={
              !Object.values(evaluationResults).every((val) => val !== null)
            }
          >
            บันทึก
          </Button>,
        ]}
        width="800px"
      >
        <Table
          dataSource={
            selectedForm?.criteria?.map((criterion) => ({
              key: criterion.id,
              criterion: criterion.name,
            })) || []
          }
          columns={[
            {
              title: "เกณฑ์การประเมิน",
              dataIndex: "criterion",
              key: "criterion",
            },
            {
              title: "ระดับการประเมิน",
              key: "evaluation",
              render: (_, record) => (
                <Radio.Group
                  onChange={(e) => {
                    setEvaluationResults({
                      ...evaluationResults,
                      [record.key]: e.target.value,
                    });
                  }}
                  value={evaluationResults[record.key] || null}
                >
                  {selectedForm?.evaluations?.map((evaluation) => (
                    <Radio key={evaluation.id} value={evaluation.label}>
                      {evaluation.label}
                    </Radio>
                  ))}
                </Radio.Group>
              ),
            },
          ]}
          pagination={false}
        />
      </Modal>
    </div>
  );
};
