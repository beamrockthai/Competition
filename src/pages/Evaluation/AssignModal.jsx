import React, { useState, useEffect } from "react";
import { Modal, Checkbox, Button, Select } from "antd";
import {
  assignForm,
  fetchTournaments,
  fetchParticipantsByTournament, //  เพิ่มฟังก์ชันนี้จาก services
} from "../../services/evaluation";

const AssignModal = ({
  visible,
  onClose,
  selectedForm,
  directors,
  onAssignSuccess,
}) => {
  const [selectedDirectors, setSelectedDirectors] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  useEffect(() => {
    if (visible) {
      loadTournaments();
      setParticipants([]); // เคลียร์ผู้เข้าแข่งขันเมื่อเปิดใหม่
      setSelectedTournament(null);
      setSelectedParticipant(null);
    }
  }, [visible]);

  const loadTournaments = async () => {
    try {
      const fetchedTournaments = await fetchTournaments();
      setTournaments(fetchedTournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  //  โหลดผู้เข้าแข่งขันเมื่อเลือกการแข่งขัน
  const handleTournamentChange = async (tournamentId) => {
    setSelectedTournament(tournamentId);
    try {
      const fetchedParticipants = await fetchParticipantsByTournament(
        tournamentId
      );
      setParticipants(fetchedParticipants);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const handleAssignForm = async () => {
    if (
      !selectedForm ||
      selectedDirectors.length === 0 ||
      !selectedTournament ||
      !selectedParticipant
    )
      return;
    try {
      await assignForm(
        selectedForm.id,
        selectedDirectors,
        selectedTournament,
        selectedParticipant
      );
      onAssignSuccess();
      onClose();
    } catch (error) {
      console.error("Error assigning form:", error);
    }

    console.log("Participant ID:", selectedParticipant);
  };

  return (
    <Modal
      title={`มอบหมายแบบฟอร์ม: ${selectedForm?.name || ""}`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          ยกเลิก
        </Button>,
        <Button
          key="assign"
          type="primary"
          onClick={handleAssignForm}
          disabled={
            selectedDirectors.length === 0 ||
            !selectedTournament ||
            !selectedParticipant
          }
        >
          มอบหมาย
        </Button>,
      ]}
    >
      <h3>เลือกการแข่งขัน</h3>
      <Select
        style={{ width: "100%" }}
        placeholder="เลือกการแข่งขัน"
        onChange={handleTournamentChange} //  เปลี่ยน handler
        value={selectedTournament}
      >
        {tournaments.map((tournament) => (
          <Select.Option key={tournament.id} value={tournament.id}>
            {tournament.tournamentName}
          </Select.Option>
        ))}
      </Select>

      <h3 style={{ marginTop: "16px" }}>เลือกผู้เข้าแข่งขัน</h3>
      <Select
        style={{ width: "100%" }}
        placeholder="เลือกผู้เข้าแข่งขัน"
        onChange={setSelectedParticipant}
        value={selectedParticipant}
      >
        {participants.map((participant, index) => (
          <Select.Option key={index} value={participant.userId}>
            {participant.fullName}
          </Select.Option>
        ))}
      </Select>

      <h3 style={{ marginTop: "16px" }}>เลือกกรรมการที่ต้องการมอบหมาย</h3>
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
      </Checkbox.Group>
    </Modal>
  );
};

export default AssignModal;
