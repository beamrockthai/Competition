import React, { useState, useEffect } from "react";
import { Modal, Checkbox, Button, Select } from "antd";
import {
  assignForm,
  fetchUsers,
  fetchTournaments,
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
      loadParticipants();
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

  const loadParticipants = async () => {
    try {
      const fetchedParticipants = await fetchUsers();
      setParticipants(
        fetchedParticipants.filter((user) => user.role === "user")
      );
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
        onChange={setSelectedTournament}
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
        {participants.map((participant) => (
          <Select.Option key={participant.id} value={participant.id}>
            {participant.firstName} {participant.lastName}
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
