import { Button, Modal, Spin, Table } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { EventId, PATH_API } from "../../../constrant";
import { TeamMemberPage } from "./TeamMember";
import { TeamDirectorPage } from "./TeamDirector";

export const TeamManagementPage = () => {
  const dataFetchedRef = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [modalData, setModalData] = useState();
  const [teamData, setTeamData] = useState();
  const [directorData, setDirectorData] = useState();
  const [loadings, setLoadings] = useState(false);
  const columns = [
    {
      title: "ชื่อทีม",
      dataIndex: "TeamName",
      key: "TeamName",
    },
    {
      title: "ชื่อผลงาน",
      dataIndex: "WorkName",
      key: "WorkName",
    },
    {
      title: "ประเภทแข่งที่สมัคร",
      dataIndex: "CompetitionType",
      key: "CompetitionType",
      render: (_, record) => (
        <>
          {record.competition_type &&
          record.competition_type.CompetitionTypeName
            ? record.competition_type.CompetitionTypeName
            : "ไม่พบ"}
        </>
      ),
    },
    {
      title: "หัวหน้าทีม",
      dataIndex: "CreatedBy",
      key: "CreatedBy",
      render: (_, record) => record.user.FirstName + " " + record.user.LastName,
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
          <Button style={{ marginLeft: 8 }} onClick={() => showModal2(record)}>
            กำหนดกรรมการ
          </Button>
        </>
      ),
    },
  ];
  const showModal = (e) => {
    setIsModalOpen(true);
    setModalData(e.id);
    setDirectorData(e);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setTeamData("");
    getTeam();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setModalData("");
    getTeam();
  };
  const showModal2 = (e) => {
    setIsModalOpen2(true);
    setModalData(e.id);
    console.log("Ehaa", e);

    setDirectorData(e);
  };
  const handleOk2 = () => {
    setIsModalOpen2(false);
    setTeamData("");
    getTeam();
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
    setModalData("");
    getTeam();
  };
  const getTeam = async () => {
    setLoadings(true);
    const data = await axios.get(PATH_API + `/groups/get/${EventId}`);
    console.log("getTeam", data);

    setTeamData(data.data);
    setLoadings(false);
  };
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getTeam();
  }, []);
  return (
    <>
      <h1>จัดการทีม</h1>
      <Table columns={columns} dataSource={teamData} loading={loadings} />
      <Modal
        title={"modalData.TeamName"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TeamMemberPage data={modalData} />
      </Modal>
      <Modal
        title={"กำหนดกรรมการ"}
        open={isModalOpen2}
        onOk={handleOk2}
        onCancel={handleCancel2}
      >
        {/* {JSON.stringify(directorData)} */}
        <TeamDirectorPage data={directorData} />
      </Modal>
    </>
  );
};
