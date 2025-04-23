import React, { useEffect, useState } from "react";
import {
  Card,
  Spin,
  Button,
  Modal,
  Table,
  Radio,
  Tabs,
  InputNumber,
  Row,
  Col,
  Grid,
} from "antd";
import {
  fetchDirecForm,
  submitEvaluationToFirestore,
  fetchEvaluations,
} from "../../services/MyForm";
import { useUserAuth } from "../../Context/UserAuth";

export default function MyForm() {
  const { user } = useUserAuth();
  const [forms, setForms] = useState([]);
  const [evaluatedFormsMap, setEvaluatedFormsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const screens = Grid.useBreakpoint();

  // modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [selectedForm, setSelectedForm] = useState(null);
  const [evaluationResults, setEvaluationResults] = useState({});
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      // 1) load assigned forms
      const formsData = await fetchDirecForm(user.id);
      setForms(formsData);
      // 2) load evaluations
      const allEvals = await fetchEvaluations();
      const evMap = {};
      allEvals
        .filter((e) => e.directorName === user.name)
        .forEach((e) => {
          evMap[e.formId] = {
            evaluationResults: e.evaluationResults,
            score: e.score,
          };
        });
      setEvaluatedFormsMap(evMap);
      setLoading(false);
    })();
  }, [user]);

  const openModal = (form) => {
    const isView = !!evaluatedFormsMap[form.id];
    setModalMode(isView ? "view" : "edit");
    setSelectedForm(form);

    if (isView) {
      const { evaluationResults, score } = evaluatedFormsMap[form.id];
      setEvaluationResults(evaluationResults);
      setTotalScore(score);
    } else {
      const init = {};
      form.criteria.forEach((c) => (init[c.id] = null));
      setEvaluationResults(init);
      setTotalScore(0);
    }

    setModalVisible(true);
  };

  const saveEvaluation = () => {
    Modal.confirm({
      title: "ยืนยันการบันทึกผลการประเมิน?",
      onOk: async () => {
        const { id: formId, name: formName, criteria } = selectedForm;
        const tournamentName =
          selectedForm?.tournamentName || "ไม่ระบุชื่อกีฬา";
        const participantName =
          selectedForm?.participantName || "ไม่ระบุนักกีฬา";

        await submitEvaluationToFirestore({
          formId,
          formName,
          tournamentName,
          participantName,
          directorName: user.name,
          evaluationResults,
          evaluations: selectedForm.evaluations,
          criteria,
          score: totalScore,
        });
        setEvaluatedFormsMap((prev) => ({
          ...prev,
          [formId]: { evaluationResults, score: totalScore },
        }));
        setModalVisible(false);
      },
    });
  };

  if (loading) return <Spin style={{ marginTop: 50 }} />;

  const toEval = forms.filter((f) => !evaluatedFormsMap[f.id]);
  const done = forms.filter((f) => evaluatedFormsMap[f.id]);

  const modalWidth = screens.xs ? "90%" : 800;

  return (
    <div style={{ padding: 20 }}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="ฟอร์มที่ต้องประเมิน" key="1">
          <Row gutter={[16, 16]}>
            {toEval.length ? (
              toEval.map((f) => (
                <Col key={f.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                  <Card title={f.name} style={{ width: "100%" }}>
                    <Button block onClick={() => openModal(f)}>
                      ประเมิน
                    </Button>
                  </Card>
                </Col>
              ))
            ) : (
              <p>ไม่มีฟอร์มที่ต้องประเมิน</p>
            )}
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="ฟอร์มที่ประเมินแล้ว" key="2">
          <Row gutter={[16, 16]}>
            {done.length ? (
              done.map((f) => (
                <Col key={f.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                  <Card title={f.name} style={{ width: "100%" }}>
                    <Button block onClick={() => openModal(f)}>
                      ดูผลการประเมิน
                    </Button>
                  </Card>
                </Col>
              ))
            ) : (
              <p>ไม่มีฟอร์มที่ประเมินแล้ว</p>
            )}
          </Row>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={`${modalMode === "edit" ? "ประเมิน" : "ผลการประเมิน"}: ${
          selectedForm?.name
        }`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={
          modalMode === "edit"
            ? [
                <Button key="c" onClick={() => setModalVisible(false)}>
                  ยกเลิก
                </Button>,
                <Button key="s" type="primary" onClick={saveEvaluation}>
                  บันทึก
                </Button>,
              ]
            : [
                <Button key="c" onClick={() => setModalVisible(false)}>
                  ปิด
                </Button>,
              ]
        }
        width={modalWidth}
      >
        {/*  แสดงชื่อกีฬาและชื่อนักกีฬา */}
        <div style={{ marginBottom: 16, lineHeight: 1.8 }}>
          <p>
            <strong>ชื่อใบประเมิน:</strong> {selectedForm?.name || "-"}
          </p>
          <p>
            <strong>ชื่อกีฬา:</strong> {selectedForm?.tournamentName || "-"}
          </p>
          <p>
            <strong>นักกีฬา:</strong> {selectedForm?.participantName || "-"}
          </p>
        </div>

        {/* ตารางการประเมิน */}
        <Table
          dataSource={selectedForm?.criteria.map((c) => ({
            key: c.id,
            criterion: c.name,
          }))}
          columns={[
            {
              title: "เกณฑ์การประเมิน",
              dataIndex: "criterion",
              key: "c",
              align: "left",
            },
            {
              title: "ระดับ",
              align: "left",
              key: "r",
              render: (_, row) => (
                <Radio.Group
                  name={`criterion-${row.key}`}
                  disabled={modalMode === "view"}
                  value={evaluationResults[row.key]}
                  onChange={(e) =>
                    setEvaluationResults((prev) => ({
                      ...prev,
                      [row.key]: e.target.value,
                    }))
                  }
                >
                  {selectedForm.evaluations.map((opt) => (
                    <Radio key={`${row.key}-${opt.id}`} value={opt.id}>
                      {" "}
                      {/* เปลี่ยนตรงนี้ */}
                      {opt.label}
                    </Radio>
                  ))}
                </Radio.Group>
              ),
            },
          ]}
          pagination={false}
        />
        {modalMode === "edit" ? (
          <div style={{ marginTop: 16, display: "flex", alignItems: "center" }}>
            <strong>คะแนนรวม:</strong>
            <InputNumber
              min={0}
              max={100}
              value={totalScore}
              onChange={setTotalScore}
              style={{ marginLeft: 8 }}
            />
          </div>
        ) : (
          <div style={{ marginTop: 16 }}>
            <strong>คะแนนรวม:</strong> {totalScore}
          </div>
        )}
      </Modal>
    </div>
  );
}
