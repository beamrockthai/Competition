import React, { useEffect, useState } from "react";
import { Card, Spin, Button, Modal, Table, Radio } from "antd";
import { fetchDirecForm } from "../../services/MyForm";
import { useUserAuth } from "../../Context/UserAuth";

const MyForm = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluationModalVisible, setEvaluationModalVisible] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [evaluationResults, setEvaluationResults] = useState({});
  const { user } = useUserAuth();

  useEffect(() => {
    if (user) {
      loadForms(user.id);
    }
  }, [user]);

  const loadForms = async (userId) => {
    try {
      const data = await fetchDirecForm(userId);
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
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

  const handleCloseModal = () => {
    setEvaluationModalVisible(false);
    setSelectedForm(null);
  };

  const handleSaveEvaluation = () => {
    console.log("Results saved:", evaluationResults);
    handleCloseModal();
  };

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: "block", textAlign: "center", marginTop: "20px" }}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        padding: "20px",
      }}
    >
      {forms.length > 0 ? (
        forms.map((form) => (
          <Card
            key={form.id}
            title={form.name}
            style={{ width: 300, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
          >
            <p>
              <strong>Title:</strong> {form.title}
            </p>
            <p>
              <strong>Description:</strong> {form.description}
            </p>
            <Button
              type="primary"
              style={{
                marginTop: "10px",
                width: "100%",
                backgroundColor: "#28a745",
                borderColor: "#28a745",
                borderRadius: "6px",
              }}
              onClick={() => handleEvaluateForm(form)}
            >
              ประเมิน
            </Button>
          </Card>
        ))
      ) : (
        <p>No forms assigned to you.</p>
      )}

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
