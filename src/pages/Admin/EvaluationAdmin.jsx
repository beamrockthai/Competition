import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, Table, Spin } from "antd";
import TableComponent from "../../components/TableComponent";
import fetchSubmitForm from "../../services/EvaluationAdmin";
import handleDelete from "../../services/EvaluationAdmin";

const { Title } = Typography;

const EvaluationAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const columns = [
    {
      title: "ชื่อผู้ส่ง",
      dataIndex: "directorName",
      key: "directorName",
      align: "left",
    },

    {
      title: "ชื่อแบบฟอร์ม",
      dataIndex: "formName",
      key: "formName",
      align: "left",
    },

    {
      title: "วันที่ส่ง",
      dataIndex: "submittedAt",
      key: "submittedAt",
      align: "left",
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },

    {
      title: "ผลการประเมิน",
      key: "evaluationView",
      render: (_, record) => (
        <Button
          onClick={() => {
            setSelectedRecord(record);
            setModalVisible(true);
          }}
        >
          ดูผลการประเมิน
        </Button>
      ),
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Button type="primary" danger onClick={() => handleDelete(record.key)}>
    //       ลบ
    //     </Button>
    //   ),
    // },
  ];
  // console.log(handleDelete.onClick, "eRr"),
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedData = await fetchSubmitForm();
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderEvaluationTable = () => {
    if (!selectedRecord) return null;
    console.log(selectedRecord, "test");

    const { criteria = [], evaluationResults = {}, score } = selectedRecord;

    const dataSource = criteria.map((criterion) => ({
      key: criterion.id,
      criterion: criterion.name,
      score: evaluationResults[criterion.id] || "ไม่ได้ประเมิน",
    }));

    console.log(dataSource, "Ne");
    const columns = [
      {
        title: "หัวข้อการประเมิน",
        dataIndex: "criterion",
        key: "criterion",
        align: "left", //  ชิดซ้าย
      },
      {
        title: "คะแนนที่ได้",
        dataIndex: "score",
        key: "score",
        align: "center", // หรือ "right" ตามต้องการ
      },
    ];

    return (
      <>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
        <div
          style={{
            marginTop: "20px",
            textAlign: "left",
            backgroundColor: "#f5f5f5",
            padding: "16px 16px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
            border: "1px solid #d9d9d9",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          คะแนนรวม:{" "}
          <span style={{ color: "#b12341", fontSize: "16px" }}>
            {score !== undefined && score !== null ? score : "ไม่ได้กรอก"}
          </span>
        </div>
      </>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3} style={{ color: "#b12341" }}>
        ข้อมูลการส่งแบบฟอร์ม
      </Title>

      {loading ? (
        <Spin size="large" style={{ display: "block", marginTop: 50 }} />
      ) : (
        <TableComponent
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      )}

      <Modal
        open={modalVisible}
        title="รายละเอียดผลการประเมิน"
        onCancel={() => {
          setModalVisible(false);
          setSelectedRecord(null);
        }}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            ปิด
          </Button>,
        ]}
        width={700}
      >
        {renderEvaluationTable()}
      </Modal>
    </div>
  );
};

export default EvaluationAdmin;
