import { useParams } from "react-router-dom";
import { Entry, Patient } from "../../types";
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

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const diagnosesContent = (e: Entry) => {
    switch (e.type) {
      case "HealthCheck":
        return (
          <div>
            <p><strong>Date: </strong>{e.date}</p>
            <p><strong>Description: </strong>{e.description}</p>
            <strong>Diagnosis codes: </strong>{e.diagnosisCodes && <ul>
              {e.diagnosisCodes.map(d => <li key={e.id.concat(d)}>{d}</li>)}
            </ul>}
          </div>
        );
      case "Hospital":
        return (
          <div>
            <p><strong>Date: </strong>{e.date}</p>
            <p><strong>Description: </strong>{e.description}</p>
            <strong>Diagnosis codes: </strong>{e.diagnosisCodes && <ul>
              {e.diagnosisCodes.map(d => <li key={e.id.concat(d)}>{d}</li>)}
            </ul>}
          </div>
        );
      case "OccupationalHealthcare":
        return (
          <div>
            <p><strong>Date: </strong>{e.date}</p>
            <p><strong>Description: </strong>{e.description}</p>
            <strong>Diagnosis codes: </strong>{e.diagnosisCodes && <ul>
              {e.diagnosisCodes.map(d => <li key={e.id.concat(d)}>{d}</li>)}
            </ul>}
          </div>
        );
      default:
        return assertNever(e);
    }
  }

  return (
    patient && (
      <div>
        <h2>{patient.name}</h2>
        <p>{patient.ssn}</p>
        <p>{patient.occupation}</p>
        <h3>Entries</h3>
        <div>
          {patient.entries.map((e) => diagnosesContent(e))}
        </div>
      </div>
    )
  );
};

export default PatientPage;
