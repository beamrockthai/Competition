import React, { useEffect, useState } from "react";
import { Card, Spin, Button, Modal, Table, Radio, Tabs } from "antd";
import {
  fetchDirecForm,
  submitEvaluationToFirestore,
  fetchEvaluations,
} from "../../services/MyForm";
import { useUserAuth } from "../../Context/UserAuth";

const MyForm = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluationModalVisible, setEvaluationModalVisible] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [evaluationResults, setEvaluationResults] = useState({});
  const [evaluatedForms, setEvaluatedForms] = useState({});
  const { user } = useUserAuth();

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          setLoading(true);
          const formsData = await fetchDirecForm(user.id);
          setForms(formsData);
          const evaluations = await fetchEvaluations();
          const evaluationsMap = evaluations.reduce((acc, evaluation) => {
            acc[evaluation.formId] = evaluation.evaluationResults;
            return acc;
          }, {});
          setEvaluatedForms(evaluationsMap);
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [user]);

  const handleEvaluateForm = (form) => {
    setSelectedForm(form);
    const savedResults = evaluatedForms[form.id] || {};
    const initialResults = {};
    form.criteria.forEach((criterion) => {
      initialResults[criterion.id] = savedResults[criterion.id] || null;
    });
    setEvaluationResults(initialResults);
    setEvaluationModalVisible(true);
  };

  const handleCloseModal = () => {
    setEvaluationModalVisible(false);
    setSelectedForm(null);
  };

  const handleSaveEvaluation = async () => {
    Modal.confirm({
      title: "ยืนยันการประเมินนี้หรือไม่?",
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        try {
          const formId = selectedForm.id;
          const formName = selectedForm.name;
          const directorName = user?.name || "Unknown Director";
          await submitEvaluationToFirestore({
            formId,
            formName,
            directorName,
            evaluationResults,
          });
          setEvaluatedForms((prev) => ({
            ...prev,
            [formId]: { ...evaluationResults },
          }));
          handleCloseModal();
        } catch (error) {
          console.error("Error saving evaluation:", error);
        }
      },
    });
  };

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: "block", textAlign: "center", marginTop: "20px" }}
      />
    );
  }

  const unEvaluatedForms = forms.filter((form) => !evaluatedForms[form.id]);
  const alreadyEvaluatedForms = forms.filter((form) => evaluatedForms[form.id]);

  return (
    <div style={{ padding: "20px" }}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="ฟอร์มที่ต้องประเมิน" key="1">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {unEvaluatedForms.length > 0 ? (
              unEvaluatedForms.map((form) => (
                <Card key={form.id} title={form.name} style={{ width: 300 }}>
                  <p>
                    <strong>Title:</strong> {form.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {form.description}
                  </p>
                  <Button
                    type="primary"
                    onClick={() => handleEvaluateForm(form)}
                  >
                    ประเมิน
                  </Button>
                </Card>
              ))
            ) : (
              <p>ไม่มีฟอร์มที่ต้องประเมิน</p>
            )}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="ฟอร์มที่ประเมินแล้ว" key="2">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {alreadyEvaluatedForms.length > 0 ? (
              alreadyEvaluatedForms.map((form) => (
                <Card key={form.id} title={form.name} style={{ width: 300 }}>
                  <p>
                    <strong>Title:</strong> {form.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {form.description}
                  </p>
                  <Button
                    type="primary"
                    onClick={() => handleEvaluateForm(form)}
                  >
                    ดูผลลัพธ์การประเมิน
                  </Button>
                </Card>
              ))
            ) : (
              <p>ไม่มีฟอร์มที่ประเมินแล้ว</p>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={`ประเมินแบบฟอร์ม: ${selectedForm?.name || ""}`}
        open={evaluationModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
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

export default MyForm;
