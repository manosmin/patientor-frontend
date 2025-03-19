import { useState } from "react";
import { Patient } from "../../types";
import HospitalEntryView from "./HospitalEntryView";
import OccupationalHealthcareEntryView from "./OccupationalHealthcareEntryView";
import HealthCheckEntryView from "./HealthCheckEntryView";

interface NewPatientEntryProps {
  id: string;
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
}

const NewPatientEntry = ({ id, patient, setPatient }: NewPatientEntryProps) => {
  const [formType, setFormType] = useState<string>('');

  return (
    <div>
      <select onChange={(e) => setFormType(e.target.value)} value={formType}>
        <option value="Hospital">Hospital</option>
        <option value="OccupationalHealthcare">Occupational Healthcare</option>
        <option value="HealthCheck">Health Check</option>
      </select>
      {(() => {
      switch (formType) {
        case "Hospital":
          return <HospitalEntryView id={id} patient={patient} setPatient={setPatient} />;
        case "OccupationalHealthcare":
          return <OccupationalHealthcareEntryView id={id} patient={patient} setPatient={setPatient} />;
        case "HealthCheck":
          return <HealthCheckEntryView id={id} patient={patient} setPatient={setPatient} />;
        default:
          return <HospitalEntryView id={id} patient={patient} setPatient={setPatient} />;
      }
    })()}
    </div>
  );
};

export default NewPatientEntry;
