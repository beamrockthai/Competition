import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { addForm, updateForm } from "../../services/evaluation";

const FormModal = ({ visible, onClose, onFormSaved, editingForm }) => {
  const [formName, setFormName] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [evaluations, setEvaluations] = useState([
    { id: Date.now(), label: "" },
  ]);

  useEffect(() => {
    if (editingForm) {
      setFormName(editingForm.name);
      setCriteria(editingForm.criteria || []);
      setEvaluations(
        editingForm.evaluations || [{ id: Date.now(), label: "" }]
      );
    } else {
      resetFormState();
    }
  }, [editingForm]);

  const resetFormState = () => {
    setFormName("");
    setCriteria([]);
    setEvaluations([{ id: Date.now(), label: "" }]);
  };

  const handleSaveForm = async () => {
    if (!formName.trim() || criteria.length === 0 || evaluations.length === 0)
      return;

    const newForm = { name: formName, criteria, evaluations };
    if (editingForm) {
      await updateForm(editingForm.id, newForm);
    } else {
      await addForm(newForm);
    }
    onFormSaved();
    onClose();
  };

  return (
    <Modal
      title={editingForm ? "แก้ไขแบบฟอร์ม" : "สร้างแบบฟอร์ม"}
      open={visible}
      onCancel={onClose}
      onOk={handleSaveForm}
      okText="บันทึก"
      cancelText="ยกเลิก"
    >
      <Form layout="vertical">
        <Form.Item label="ชื่อแบบฟอร์ม">
          <Input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="ใส่ชื่อแบบฟอร์ม"
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
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormModal;
