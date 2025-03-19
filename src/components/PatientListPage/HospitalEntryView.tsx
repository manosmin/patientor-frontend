import { useState } from "react";
import { HospitalEntry, Patient } from "../../types";
import axios from "axios";
import patientService from "../../services/patients";
import { errorStyle } from "../../styles/styles";

interface HospitalEntryProps {
  id: string;
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
}

const HospitalEntryView = ({ id, patient, setPatient }: HospitalEntryProps) => {
  const [formData, setFormData] = useState<HospitalEntry>({
    id: "",
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
    type: "Hospital",
    discharge: { date: "", criteria: "" },
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDischargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      discharge: {
        ...prev.discharge,
        [name]: value,
      },
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
      <h2>Hospital Entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label>Specialist:</label>
          <input
            type="text"
            name="specialist"
            value={formData.specialist}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label>Discharge Criteria:</label>
          <input
            type="text"
            name="criteria"
            value={formData.discharge.criteria}
            onChange={(e) => handleDischargeChange(e)}
          />
        </div>
        <div>
          <label>Discharge Date:</label>
          <input
            type="date"
            name="date"
            value={formData.discharge.date}
            onChange={(e) => handleDischargeChange(e)}
          />
        </div>
        <div>
          <label>Diagnosis Codes:</label>
          <input
            type="text"
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

export default HospitalEntryView;
