import { useParams } from "react-router-dom";
import { Diagnosis, Entry, Patient } from "../../types";
import { useEffect, useState } from "react";
import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();
  const id = useParams().id;

  useEffect(() => {
    if (!id) return;
    const fetchPatient = async () => {
      const patient = await patientService.getOne(id);
      setPatient(patient);
    };

    void fetchPatient();
  }, [id]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnosisService.getAll();
      setDiagnoses(diagnoses);
    };

    void fetchDiagnoses();
  }, []);

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const mapDiagnosisToCode = (code: string): string => {
    if (!diagnoses) return code;

    const diagnosis = diagnoses.find((d) => d.code == code);

    if (diagnosis) {
      return code + ' ' + diagnosis.name;
    } else {
      return code;
    }
  };

  const diagnosesContent = (e: Entry) => {
    switch (e.type) {
      case "HealthCheck":
        return (
          <div>
            <p>
              <strong>Date: </strong>
              {e.date}
            </p>
            <p>
              <strong>Description: </strong>
              {e.description}
            </p>
            <strong>Diagnosis codes: </strong>
            {e.diagnosisCodes && (
              <ul>
                {e.diagnosisCodes.map((d) => (
                  <li key={e.id.concat(d)}>{mapDiagnosisToCode(d)}</li>
                ))}
              </ul>
            )}
          </div>
        );
      case "Hospital":
        return (
          <div>
            <p>
              <strong>Date: </strong>
              {e.date}
            </p>
            <p>
              <strong>Description: </strong>
              {e.description}
            </p>
            <strong>Diagnosis codes: </strong>
            {e.diagnosisCodes && (
              <ul>
                {e.diagnosisCodes.map((d) => (
                  <li key={e.id.concat(d)}>{mapDiagnosisToCode(d)}</li>
                ))}
              </ul>
            )}
          </div>
        );
      case "OccupationalHealthcare":
        return (
          <div>
            <p>
              <strong>Date: </strong>
              {e.date}
            </p>
            <p>
              <strong>Description: </strong>
              {e.description}
            </p>
            <strong>Diagnosis codes: </strong>
            {e.diagnosisCodes && (
              <ul>
                {e.diagnosisCodes.map((d) => (
                  <li key={e.id.concat(d)}>{mapDiagnosisToCode(d)}</li>
                ))}
              </ul>
            )}
          </div>
        );
      default:
        return assertNever(e);
    }
  };

  return (
    patient && (
      <div>
        <h2>{patient.name}</h2>
        <p>{patient.ssn}</p>
        <p>{patient.occupation}</p>
        <h3>Entries</h3>
        <div>{patient.entries.map((e) => diagnosesContent(e))}</div>
      </div>
    )
  );
};

export default PatientPage;
