import { useState } from "react";
import { HealthCheckEntry, Patient } from "../../types";
import axios from "axios";
import patientService from "../../services/patients";
import { errorStyle } from "../../styles/styles";

interface HospitalEntryProps {
  id: string;
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
}

const HealthCheckEntryView = ({ id, patient, setPatient }: HospitalEntryProps) => {
  const [formData, setFormData] = useState<HealthCheckEntry>({
    id: "",
    description: "",
    date: "",
    specialist: "",
    healthCheckRating: 0,
    diagnosisCodes: [],
    type: "HealthCheck",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;    
    setFormData((prev) => ({
      ...prev,
      [name]: name === "healthCheckRating" ? Number(value) : value,
    }));
  };

  const handleDiagnosisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      diagnosisCodes: value.split(",").map((code) => code.trim()),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    try {
      const newPatientEntry = await patientService.createGeneralEntry(id, {
        ...formData,
        id: id,
      });
      setPatient({ ...patient, entries: newPatientEntry.entries });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        if (error.response.data.error[0].message) {
          setError(error.response.data.error[0].message);
          setTimeout(() => {
            setError("");
          }, 5000);
        } else {
          setError("Error inserting entry.");
          setTimeout(() => {
            setError("");
          }, 5000);
        }
      }
    }
  };

  return (
    <div>
      {error && <div style={errorStyle}>{error}</div>}
      <h2>Health Check Entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <input
            name="description"
            value={formData.description}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            name="date"
            value={formData.date}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label>Specialist:</label>
          <input
            name="specialist"
            value={formData.specialist}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label>Health Check Rating:</label>
          <input
            name="healthCheckRating"
            value={formData.healthCheckRating}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label>Diagnosis Codes:</label>
          <input
            name="diagnosisCodes"
            value={formData.diagnosisCodes?.join(", ")}
            onChange={(e) => handleDiagnosisChange(e)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default HealthCheckEntryView;
