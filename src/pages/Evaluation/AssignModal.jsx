import React, { useState, useEffect } from "react";
import { Modal, Checkbox, Button, Select } from "antd";
import {
  assignForm,
  fetchUsers,
  fetchTournaments,
} from "../../services/evaluation";
import axios from "axios";
import { EventId, PATH_API } from "../../constrant";

const AssignModal = ({
  visible,
  onClose,
  selectedForm,
  directors,
  onAssignSuccess,
}) => {
  const [selectedDirectors, setSelectedDirectors] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedCompRound, setSelectedCompRound] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [competitionRound, setCompetitionRound] = useState();
  useEffect(() => {
    if (visible) {
      setSelectedTournament(selectedForm.CompetitionTypeId);
      setSelectedCompRound(selectedForm.CompetitionRoundId);
      loadTournaments();
      // loadParticipants();
      getRound();
    }
  }, [visible]);

  //แสดงtournamentทุกรายการในตาราง
  const loadTournaments = async () => {
    try {
      const fetchedTournaments = await fetchTournaments();
      setTournaments(fetchedTournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };
  const getRound = async () => {
    try {
      const compround = await axios.get(
        PATH_API + `/competition_rounds/get/${EventId}`
      );
      setCompetitionRound(compround.data);
    } catch (error) {
      console.error("Error getRound", error);
    }
  };
  // const loadParticipants = async () => {
  //   try {
  //     const fetchedParticipants = await fetchUsers();
  //     setParticipants(
  //       fetchedParticipants.filter((user) => user.role === "user")
  //     );
  //   } catch (error) {
  //     console.error("Error fetching participants:", error);
  //   }
  // };

  const handleAssignForm = async () => {
    // if (!selectedForm || !selectedTournament || !selectedCompRound) return;
    try {
      // await assignForm(
      //   selectedForm.id,

      //   selectedTournament,
      //   competitionRound
      // );

      const data = await axios.patch(PATH_API + `/evaluation_forms/update`, {
        id: selectedForm.id,
        CompetitionTypeId: selectedTournament,
        CompetitionRoundId: selectedCompRound,
      });
      console.log("handleAssignForm", data);

      onAssignSuccess();
      onClose();
    } catch (error) {
      console.error("Error assigning form:", error);
    }
  };

  return (
    <>
      {/* {JSON.stringify(selectedForm)} */}
      <Modal
        title={`มอบหมายแบบฟอร์ม: ${selectedForm?.Name || ""}`}
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="cancel" onClick={onClose}>
            ยกเลิก
          </Button>,
          <Button
            key="assign"
            type="primary"
            onClick={() => handleAssignForm()}
            disabled={!selectedTournament || !competitionRound}
          >
            กำหนด
          </Button>,
        ]}
      >
        <h3>เลือกการแข่งขัน</h3>
        <Select
          style={{ width: "100%" }}
          placeholder="เลือกการแข่งขัน"
          onChange={setSelectedTournament}
          value={selectedTournament}
        >
          {tournaments.map((tournament) => (
            <Select.Option key={tournament.id} value={tournament.id}>
              {tournament.CompetitionTypeName}
            </Select.Option>
          ))}
        </Select>

        <h3 style={{ marginTop: "16px" }}>เลือกรอบ</h3>
        <Select
          style={{ width: "100%" }}
          placeholder="เลือกรอบ"
          onChange={setSelectedCompRound}
          value={selectedCompRound}
        >
          {competitionRound?.map((competitionRound) => (
            <Select.Option
              key={competitionRound.id}
              value={competitionRound.id}
            >
              {competitionRound.Details}
            </Select.Option>
          ))}
        </Select>

        {/* <h3 style={{ marginTop: "16px" }}>เลือกกรรมการที่ต้องการมอบหมาย</h3>
      <Checkbox.Group
        style={{ display: "flex", flexDirection: "column" }}
        value={selectedDirectors}
        onChange={setSelectedDirectors}
      >
        {directors.length > 0 ? (
          directors.map((director) => (
            <Checkbox key={director.id} value={director.id}>
              {director.firstName} {director.lastName} ({director.email})
            </Checkbox>
          ))
        ) : (
          <p>ไม่มีกรรมการให้เลือก</p>
        )}
      </Checkbox.Group> */}
      </Modal>
    </>
  );
};

export default AssignModal;
