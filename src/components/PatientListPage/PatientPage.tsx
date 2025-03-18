import { useParams } from "react-router-dom";
import { Patient } from "../../types";
import { useEffect, useState } from "react";
import patientService from "../../services/patients";

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>();
  const id = useParams().id;

  useEffect(() => {
    if (!id) return;
    const fetchPatient = async () => {
      const patient = await patientService.getOne(id);
      setPatient(patient);
    };

    void fetchPatient();
  }, [id]);

  return (
    patient && (
      <div>
        <h2>{patient.name}</h2>
        <p>{patient.ssn}</p>
        <p>{patient.occupation}</p>
      </div>
    )
  );
};

export default PatientPage;
