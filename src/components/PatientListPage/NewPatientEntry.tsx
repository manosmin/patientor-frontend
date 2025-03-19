import { useState } from "react";
import patientService from '../../services/patients';
import { HealthCheckEntry, Patient } from "../../types";

interface NewPatientEntryProps {
    id: string;
    patient: Patient;
    setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
}

const NewPatientEntry = ({ id, patient, setPatient }: NewPatientEntryProps) => {
  const [formData, setFormData] = useState<HealthCheckEntry>({
    id: "",
    description: "",
    date: "",
    specialist: "",
    healthCheckRating: 0,
    diagnosisCodes: [],
    type: "HealthCheck",
  });

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
    const newPatientEntry = await patientService.createHealthCheckEntry(id, {...formData, id: id});
    setPatient({ ...patient, entries: newPatientEntry.entries });
  };

  return (
    <div>
      <h2>Health Check Entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div>
          <label>Specialist:</label>
          <input
            type="text"
            name="specialist"
            value={formData.specialist}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div>
          <label>Health Check Rating:</label>
          <input
            type="number"
            name="healthCheckRating"
            value={formData.healthCheckRating}
            onChange={(e) => handleChange(e)}
            required
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

export default NewPatientEntry;