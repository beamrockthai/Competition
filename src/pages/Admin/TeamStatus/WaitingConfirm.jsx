import { Button, Modal, Table } from "antd";
import { EventId, PATH_API } from "../../../constrant";
import { useEffect, useState } from "react";
import axios from "axios";

export const WaitingConfirmPage = () => {
  const status = "WaitingConfirm";
  const [waitingConfirmData, setWaitingConfirmData] = useState();
  const [answer, setAnswer] = useState();
  const [tableLoading, setTableLoading] = useState();
  const [modalLoading, setModalLoading] = useState();

  useEffect(() => {
    getWaitingConfirm();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (e) => {
    setIsModalOpen(true);
    getAnswer(e);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const getWaitingConfirm = () => {
    setTableLoading(true);
    axios
      .get(PATH_API + `/evaluation_results/getbystatus/${status}/${EventId}`)
      .then((res) => {
        console.log("getTeam", res.data);
        setWaitingConfirmData(res.data);
        setTableLoading(false);
      });
  };
  const getAnswer = (e) => {
    setModalLoading(true);
    axios
      .get(
        PATH_API +
          `/evaluation_answers/getbyteam/${e.id}/${e.CompetitionTypeId}/${e.CompetitionRoundId}/${EventId}`
      )
      .then((res) => {
        console.log("getAnswer", res.data);

        const countByCreatedBy = res.data.reduce((acc, item) => {
          acc[item.CreatedBy] = (acc[item.CreatedBy] || 0) + 1;
          return acc;
        }, {});

        // ใช้ map() แทน forEach เพื่อให้ค่าถูกคืนออกมา
        const newdata = Object.entries(countByCreatedBy).map(
          ([key, value]) => `${value}`
        );

        console.log(newdata);
        setAnswer(newdata.join(", ")); // รวมเป็น string เพื่อแสดงผลใน Modal
        setModalLoading(false);
      });
  };
  const columns = [
    {
      title: "ชื่อทีม",
      dataIndex: "TeamName",
      key: "TeamName",
      render: (_, record) => <>{record.group.TeamName}</>,
    },
    {
      title: "รอบ",
      dataIndex: "CompetitionRoundId",
      key: "CompetitionRoundId",
      render: (_, record) => <>{record.competition_round.Details}</>,
    },
    {
      title: "ประเภท",
      dataIndex: "CompetitionTypeId",
      key: "CompetitionTypeId",
      render: (_, record) => <>{record.competition_type.CompetitionTypeName}</>,
    },
    {
      title: "สถานะ",
      dataIndex: "Status",
      key: "Status",
    },
    {
      title: "การจัดการ",
      dataIndex: "Status",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)}>ทำการประมวลคะแนน</Button>
        </>
      ),
    },
  ];
  return (
    <>
      WaitingConfirmPage
      <Table
        columns={columns}
        dataSource={waitingConfirmData}
        loading={tableLoading}
      />
      <Modal
        title="ผลการประมวลคะแนน"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        loading={modalLoading}
      >
        <span>
          จำนวนกรรมการที่ประเมิน : {answer}
          <br />
          ผลคะแนนคนที่ 1 :
          <br />
          เฉลี่ย :
          <br />
          ยืนยันบันทึกผลคะแนนหรือไม่ ?
        </span>
      </Modal>
    </>
  );
};
