import { useParams } from "react-router-dom";
import { Diagnosis, Entry, Patient } from "../../types";
import { useEffect, useState } from "react";
import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import WorkIcon from "@mui/icons-material/Work";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

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
      return code + " " + diagnosis.name;
    } else {
      return code;
    }
  };

  const healthCheckRatingToIcon = (rating: number) => {
    switch (rating) {
      case 0:
        return <FavoriteRoundedIcon color="primary" />;
      case 1:
        return <FavoriteRoundedIcon color="success" />;
      case 2:
        return <FavoriteRoundedIcon color="error" />;
      case 3:
        return <FavoriteRoundedIcon color="warning" />;
      default:
        return <FavoriteRoundedIcon color="secondary" />;
    }
  };

  const diagnosesContent = (e: Entry) => {
    switch (e.type) {
      case "HealthCheck":
        return (
          <div>
            <MedicalInformationIcon />
            <p>
              <strong>Date: </strong>
              {e.date}
            </p>
            <p>
              <strong>Description: </strong>
              {e.description}
            </p>
            <p>
              <strong>Diagnose by: </strong>
              {e.specialist}
            </p>
            {e.diagnosisCodes && (
              <>
                <strong>Diagnosis codes: </strong>
                <ul>
                  {e.diagnosisCodes.map((d) => (
                    <li key={e.id.concat(d)}>{mapDiagnosisToCode(d)}</li>
                  ))}
                </ul>
              </>
            )}
            <p>{healthCheckRatingToIcon(e.healthCheckRating)}</p>
          </div>
        );
      case "Hospital":
        return (
          <div>
            <VaccinesIcon />
            <p>
              <strong>Date: </strong>
              {e.date}
            </p>
            <p>
              <strong>Description: </strong>
              {e.description}
            </p>
            <p>
              <strong>Diagnose by: </strong>
              {e.specialist}
            </p>
            {e.diagnosisCodes && (
              <>
                <strong>Diagnosis codes: </strong>
                <ul>
                  {e.diagnosisCodes.map((d) => (
                    <li key={e.id.concat(d)}>{mapDiagnosisToCode(d)}</li>
                  ))}
                </ul>
              </>
            )}
            <div>
              <p>
                <strong>Discharge: </strong>
                {e.discharge.date}, {e.discharge.criteria}
              </p>
            </div>
          </div>
        );
      case "OccupationalHealthcare":
        return (
          <div>
            <WorkIcon />
            <p>
              <strong>Date: </strong>
              {e.date}
            </p>
            <p>
              <strong>Description: </strong>
              {e.description}
            </p>
            {e.diagnosisCodes && (
              <>
                <strong>Diagnosis codes: </strong>
                <ul>
                  {e.diagnosisCodes.map((d) => (
                    <li key={e.id.concat(d)}>{mapDiagnosisToCode(d)}</li>
                  ))}
                </ul>
              </>
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
