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
    },
    {
      title: "ชื่อแบบฟอร์ม",
      dataIndex: "formName",
      key: "formName",
    },
    {
      title: "วันที่ส่ง",
      dataIndex: "submittedAt",
      key: "submittedAt",
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
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" danger onClick={() => handleDelete(record.key)}>
          ลบ
        </Button>
      ),
    },
  ];

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

    const { criteria = [], evaluationResults = {} } = selectedRecord;

    const dataSource = criteria.map((criterion) => ({
      key: criterion.id,
      criterion: criterion.name,
      score: evaluationResults[criterion.id] || "ไม่ได้ประเมิน",
    }));

    const columns = [
      {
        title: "หัวข้อการประเมิน",
        dataIndex: "criterion",
        key: "criterion",
      },
      {
        title: "คะแนนที่ได้",
        dataIndex: "score",
        key: "score",
      },
    ];

    return (
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>ข้อมูลการส่งแบบฟอร์ม</Title>

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
