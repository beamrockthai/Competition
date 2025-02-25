import React, { useState, useEffect } from "react";
import { Modal, Checkbox, Button, Select } from "antd";
import {
  assignForm,
  fetchUsers,
  fetchTournaments,
  getUsersById,
} from "../../services/evaluation";
import { getUserByTournament } from "../../services/registrationService";
import { assignFormToDirectorwithTournament } from "../../services/directorwithformeithteam";

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
      // loadParticipants();
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

  const onParticipantChange = (e) => {
    console.log(e);

    setSelectedParticipant(e);
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
    if (
      !selectedForm ||
      selectedDirectors.length === 0 ||
      !selectedTournament ||
      !selectedParticipant ||
      !selectedParticipant
    )
      return window.alert("No", selectedParticipant);
    try {
      await assignFormToDirectorwithTournament({
        registerId: selectedParticipant,
        evaformId: selectedForm.id,
        directorId: selectedDirectors,
        tournamentId: selectedTournament,
      });
      onAssignSuccess();
      onClose();
    } catch (error) {
      console.error("Error assigning form:", error);
    }
  };
  const onTournamentChange = async (e) => {
    console.log("เลือกการแข่งขัน:", e);
    setSelectedTournament(e);
    const data = (await getUserByTournament(e)) || []; // ✅ ป้องกัน `null`

    setParticipants(data);
    console.log("ผู้เข้าแข่งขันที่ดึงมา:", data);
  };

  console.log("participants", participants);

  // const onGetUserforSelect = (e) => {
  //   const data = getUsersById(e);

  //   const filterData = data.firstName;
  //   console.log("onGetUserforSelect", filterData);
  //   return filterData;
  // };

  return (
    <div>
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
          onChange={onTournamentChange}
        >
          {tournaments?.map((tournament) => (
            <Select.Option key={tournament.id} value={tournament.id}>
              {tournament.tournamentName}
            </Select.Option>
          ))}
        </Select>

        <h3 style={{ marginTop: "16px" }}>เลือกผู้เข้าแข่งขัน</h3>
        <Select
          style={{ width: "100%" }}
          placeholder="เลือกผู้เข้าแข่งขัน"
          onChange={onParticipantChange}
          value={selectedParticipant}
        >
          {participants?.map((e) => (
            <Select.Option key={e.id} value={e.id}>
              {e.teamType === "team"
                ? e.teamName
                : e.teamType === "individual"
                ? e.userFirstName
                : null}
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
    </div>
  );
};

export default AssignModal;
