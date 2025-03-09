import { Button, Modal, Table } from "antd";
import { useState } from "react";
import { EvaluationPage } from "./Evaluation";

export const DirectorHomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const columns = [
    {
      title: "ชื่อทีม",
      dataIndex: "TeamName",
      key: "TeamName",
    },
    {
      title: "รอบ",
      dataIndex: "CompetitionRoundId",
      key: "CompetitionRoundId",
    },
    {
      title: "ประเภท",
      dataIndex: "CompetitionTypeId",
      key: "CompetitionTypeId",
    },
    {
      title: "การจัดการ",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => showModal(record)}>
            แก้ไข
          </Button>
          <Button danger style={{ marginLeft: 8 }}>
            ลบ
          </Button>
          <Button onClick={() => showModal(record)}>กำหนดกรรมการ</Button>
        </>
      ),
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <h1>รายการที่ฉันต้องประเมิน</h1>

      <Table columns={columns} />
      <button onClick={() => setIsModalOpen(true)}>เปิร์ด</button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <EvaluationPage />
      </Modal>
    </>
  );
};
