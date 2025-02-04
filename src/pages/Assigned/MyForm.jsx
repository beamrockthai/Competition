import React, { useEffect, useState } from "react";
import { Card, Spin, Button, Modal, Table, Radio } from "antd";
import {
  fetchDirecForm,
  submitEvaluationToFirestore,
  fetchEvaluations,
} from "../../services/MyForm"; // Import ฟังก์ชันจาก MyForm.js
import { useUserAuth } from "../../Context/UserAuth";

const MyForm = () => {
  const [forms, setForms] = useState([]); // เก็บข้อมูลแบบฟอร์ม
  const [loading, setLoading] = useState(true); // สถานะโหลดข้อมูล
  const [evaluationModalVisible, setEvaluationModalVisible] = useState(false); // การแสดง Modal การประเมิน
  const [selectedForm, setSelectedForm] = useState(null); // ฟอร์มที่เลือกสำหรับการประเมิน
  const [evaluationResults, setEvaluationResults] = useState({}); // ผลลัพธ์การประเมิน
  const [evaluatedForms, setEvaluatedForms] = useState({}); // เก็บฟอร์มที่ประเมินแล้ว
  const { user } = useUserAuth(); // ข้อมูลผู้ใช้ (เช่น id, name)

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          setLoading(true);

          // ดึงแบบฟอร์มที่เกี่ยวข้องกับผู้ใช้
          const formsData = await fetchDirecForm(user.id);
          setForms(formsData);

          // ดึงผลการประเมินจาก Firestore
          const evaluations = await fetchEvaluations();
          const evaluationsMap = evaluations.reduce((acc, evaluation) => {
            acc[evaluation.formId] = evaluation.evaluationResults; // Map formId กับผลการประเมิน
            return acc;
          }, {});

          // อัปเดต State
          setEvaluatedForms(evaluationsMap);
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setLoading(false); // ยกเลิกสถานะโหลด
        }
      }
    };

    loadData();
  }, [user]); // ใช้งานเมื่อ user เปลี่ยน

  // ฟังก์ชันโหลดแบบฟอร์ม
  const loadForms = async (userId) => {
    try {
      const data = await fetchDirecForm(userId); // ดึงข้อมูลฟอร์มจาก MyForm.js
      setForms(data); // ตั้งค่าข้อมูลฟอร์มใน state
    } catch (error) {
      console.error("Error fetching forms:", error); // แสดงข้อผิดพลาดเมื่อโหลดฟอร์มล้มเหลว
    } finally {
      setLoading(false); // ยกเลิกสถานะโหลด
    }
  };

  // ฟังก์ชันเริ่มการประเมินฟอร์ม
  const handleEvaluateForm = (form) => {
    setSelectedForm(form); // ตั้งค่าฟอร์มที่เลือก

    // โหลดผลการประเมินเดิมถ้ามี
    const savedResults = evaluatedForms[form.id] || {};
    const initialResults = {};

    form.criteria.forEach((criterion) => {
      initialResults[criterion.id] = savedResults[criterion.id] || null; // ใช้ค่าที่เคยบันทึก
    });

    setEvaluationResults(initialResults); // ตั้งค่าผลการประเมินเริ่มต้น
    setEvaluationModalVisible(true); // เปิด Modal การประเมิน
  };

  // ฟังก์ชันปิด Modal การประเมิน
  const handleCloseModal = () => {
    setEvaluationModalVisible(false);
    setSelectedForm(null); // รีเซ็ตฟอร์มที่เลือก
  };

  // ฟังก์ชันบันทึกการประเมิน
  const handleSaveEvaluation = async () => {
    Modal.confirm({
      title: "ยืนยันการประเมินนี้หรือไม่?",
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        try {
          const formId = selectedForm.id;
          const formName = selectedForm.name;
          const directorName = user?.name || "Unknown Director"; // ใช้ฟิลด์ name จาก user

          // ส่งข้อมูลไปยัง Firestore
          await submitEvaluationToFirestore({
            formId,
            formName,
            directorName,
            evaluationResults,
          });

          // อัปเดตสถานะการประเมิน
          setEvaluatedForms((prev) => ({
            ...prev,
            [formId]: { ...evaluationResults },
          }));

          handleCloseModal(); // ปิด Modal หลังบันทึก
        } catch (error) {
          console.error("Error saving evaluation:", error);
        }
      },
    });
  };

  // ถ้าอยู่ในสถานะโหลดแสดง Spin
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
      {/* แสดงแบบฟอร์ม */}
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
                borderRadius: "6px",
                backgroundColor: evaluatedForms[form.id]
                  ? "#17a2b8" // สีสำหรับฟอร์มที่ประเมินแล้ว
                  : "#28a745", // สีสำหรับฟอร์มที่ยังไม่ประเมิน
              }}
              onClick={() => handleEvaluateForm(form)} // เริ่มประเมิน
            >
              {evaluatedForms[form.id] ? "ดูผลลัพธ์การประเมิน" : "ประเมิน"}
            </Button>
          </Card>
        ))
      ) : (
        <p>No forms assigned to you.</p>
      )}

      {/* Modal การประเมิน */}
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
        {/* ตารางการประเมิน */}
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
