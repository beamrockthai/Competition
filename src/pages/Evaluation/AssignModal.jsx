import React, { useState, useEffect } from "react";
import { Modal, Checkbox, Button, Select } from "antd";
import {
  assignForm,
  fetchTournaments,
  fetchParticipantsByTournament,
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
  const [tournamentName, setTournamentName] = useState("");
  const [participantName, setParticipantName] = useState("");

  useEffect(() => {
    if (visible) {
      loadTournaments();
      setParticipants([]);
      setSelectedTournament(null);
      setSelectedParticipant(null);
      setTournamentName("");
      setParticipantName("");
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

  const handleTournamentChange = async (tournamentId) => {
    setSelectedTournament(tournamentId);
    const tournament = tournaments.find((t) => t.id === tournamentId);
    setTournamentName(tournament?.tournamentName || "");
    try {
      const fetchedParticipants = await fetchParticipantsByTournament(
        tournamentId
      );
      setParticipants(fetchedParticipants);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const handleParticipantChange = (userId) => {
    setSelectedParticipant(userId);
    const participant = participants.find((p) => p.userId === userId);
    setParticipantName(participant?.fullName || "");
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
        selectedParticipant,
        selectedTournament,
        tournamentName,
        participantName
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
      <div className="space-y-4">
        <div>
          <h3>เลือกการแข่งขัน</h3>
          <Select
            style={{ width: "100%" }}
            placeholder="เลือกการแข่งขัน"
            onChange={handleTournamentChange}
            value={selectedTournament}
          >
            {tournaments.map((tournament) => (
              <Select.Option key={tournament.id} value={tournament.id}>
                {tournament.tournamentName}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <h3>เลือกผู้เข้าแข่งขัน</h3>
          <Select
            style={{ width: "100%" }}
            placeholder="เลือกผู้เข้าแข่งขัน"
            onChange={handleParticipantChange}
            value={selectedParticipant}
          >
            {participants.map((participant, index) => (
              <Select.Option key={index} value={participant.userId}>
                {participant.fullName}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <h3>เลือกกรรมการที่ต้องการมอบหมาย</h3>
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
        </div>
      </div>
    </Modal>
  );
};

export default AssignModal;
