import { Button, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { EventId, PATH_API } from "../../../constrant";

export const WaitingEvaluationPage = () => {
  const status = "No";
  const [teamData, setTeamData] = useState();
  useEffect(() => {
    getTeam();
  }, []);
  const getTeam = () => {
    axios
      .get(PATH_API + `/director_with_groups/getbystatus/${status}/${EventId}`)
      .then((res) => {
        console.log("getTeam", res.data);
        setTeamData(res.data);
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
      dataIndex: "CompetitionRound",
      key: "CompetitionRoundId",
      render: (_, record) => <>{record.competition_round.Details}</>,
    },
    {
      title: "ประเภท",
      dataIndex: "CompetitionType",
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
          {record.Status === "No" ? (
            <Button type="primary">ประเมิน</Button>
          ) : (
            <Button type="default">ประวัติประเมิน</Button>
          )}
          {/* <Button type="primary" onClick={() => showModal(record)}>
              ประเมิน
            </Button> */}
        </>
      ),
    },
  ];
  return (
    <>
      WaitingEvaluationPage
      <Table columns={columns} dataSource={teamData} />
    </>
  );
};
