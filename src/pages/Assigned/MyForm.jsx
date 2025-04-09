import React, { useEffect, useState } from "react";
import { Card, Spin, Button, Modal, Table, Radio, Tabs } from "antd";
import {
  fetchDirecForm,
  submitEvaluationToFirestore,
  fetchEvaluations,
} from "../../services/MyForm";
import { loadUsers } from "../../services/userFunctions";
import { useUserAuth } from "../../Context/UserAuth";
import { use } from "react";

const MyForm = () => {
  const [forms, setForms] = useState([]);
  const [users, setUsers] = useState([]);
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
          const formsData = await fetchDirecForm(user.id); // ไอดีกรรมการ

          // const formsData = await fetchDirecForm(user.uid); //ใหม่
          console.log("Logged in UID:", user?.id);
          setForms(formsData);
          console.log("formsData:", formsData);

          const evaluations = await fetchEvaluations();

          const allUsers = await loadUsers();
          console.log(" users:", allUsers); // ← เพิ่มตรงนี้
          setUsers(allUsers);

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
          const criteria = selectedForm?.criteria || [];

          await submitEvaluationToFirestore({
            formId,
            formName,
            directorName,
            evaluationResults,
            criteria,
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
  const participant = users.find((u) => u.id === forms.participantId);

  return (
    <div style={{ padding: "20px" }}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="ฟอร์มที่ต้องประเมิน" key="1">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {unEvaluatedForms.length > 0 ? (
              unEvaluatedForms.map((form) => {
                const participant = users.find(
                  (u) => u.id === form.participantId
                );
                // console.log("🔎 form:", form);
                // console.log("📌 form.participantId:", form.participantId);
                // console.log(
                //   "👤 Assigned participant name:",
                //   user?.firstName,
                //   user?.lastName
                // );
                return (
                  <Card key={form.id} title={form.name} style={{ width: 300 }}>
                    <p>
                      <strong>ชื่อกีฬาที่ต้องประเมิน:</strong> {form.name}
                    </p>
                    <p>
                      <strong>นักกีฬาที่ต้องประเมิน:</strong>
                      {participant
                        ? `${participant.firstName} ${participant.lastName}`
                        : "ไม่พบชื่อนักกีฬา"}
                    </p>

                    <Button
                      type="primary"
                      onClick={() => handleEvaluateForm(form)}
                    >
                      ประเมิน
                    </Button>
                  </Card>
                );
              })
            ) : (
              <p>ไม่มีฟอร์มที่ต้องประเมิน</p>
            )}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="ฟอร์มที่ประเมินแล้ว" key="2">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {alreadyEvaluatedForms.length > 0 ? (
              alreadyEvaluatedForms.map((form) => {
                const participant = users.find(
                  (u) => u.id === form.participantId
                );
                return (
                  <Card key={form.id} title={form.name} style={{ width: 300 }}>
                    <p>
                      <strong>ชื่อกีฬา:</strong> {form.name}
                    </p>
                    <p>
                      <strong>นักกีฬาที่ต้องประเมิน:</strong>
                      {participant
                        ? `${participant.firstName} ${participant.lastName}`
                        : "ไม่พบชื่อนักกีฬา"}
                    </p>
                    <Button
                      type="primary"
                      onClick={() => handleEvaluateForm(form)}
                    >
                      ดูผลลัพธ์การประเมิน
                    </Button>
                  </Card>
                );
              })
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
