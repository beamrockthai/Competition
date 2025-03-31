import React, { useState, useEffect } from "react";
import { Button } from "antd";
import {
  fetchForms,
  fetchDirectors,
  deleteForm,
} from "../../services/evaluation";
import FormModal from "./FormModal";
import AssignModal from "./AssignModal";
import EvaluationTable from "./EvaluationTable";
import axios from "axios";
import { EventId, PATH_API } from "../../constrant";

export const EvaluationPage = () => {
  const [forms, setForms] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForms();
    loadDirectors();
  }, []);

  const loadForms = async () => {
    setLoading(true);
    try {
      const fetchedForms = await axios.get(
        PATH_API + `/evaluation_forms/get/${EventId}`
      );
      console.log("fetchedForms", fetchedForms);

      setForms(fetchedForms.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDirectors = async () => {
    try {
      const fetchedDirectors = await fetchDirectors();
      setDirectors(fetchedDirectors);
    } catch (error) {
      console.error("Error fetching directors:", error);
    }
  };

  const handleDeleteForm = async (id) => {
    console.log("handleDeleteForm", id);

    setLoading(true);
    try {
      await axios.post(PATH_API + `/evaluation_forms/delete/${id}`);
      loadForms();
    } catch (error) {
      console.error("Error deleting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>แบบประเมินการแข่งขัน</h2>
      <Button
        type="primary"
        onClick={() => setIsFormModalVisible(true)}
        style={{ marginBottom: "20px" }}
      >
        สร้างแบบประเมิน
      </Button>

      <EvaluationTable
        forms={forms}
        loading={loading}
        onEdit={(form) => {
          setEditingForm(form);
          setIsFormModalVisible(true);
        }}
        onDelete={handleDeleteForm}
        onAssign={(form) => {
          setSelectedForm(form);
          setIsAssignModalVisible(true);
        }}
      ></EvaluationTable>

      <FormModal
        visible={isFormModalVisible}
        onClose={() => {
          setIsFormModalVisible(false), setSelectedForm(null);
        }}
        onFormSaved={loadForms}
        editingForm={editingForm}
      />

      <AssignModal
        visible={isAssignModalVisible}
        onClose={() => {
          setIsAssignModalVisible(false), setSelectedForm(null);
        }}
        selectedForm={selectedForm}
        directors={directors}
        onAssignSuccess={loadForms}
      ></AssignModal>
    </div>
  );
};
