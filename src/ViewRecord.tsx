import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { fetchMedicalRecords, fetchPetProfiles, MedicalRecord, PetProfile } from "./utils/supabase";

function ViewRecord() {
  const { recordId } = useParams();
  const [medicalRecord, setRecord] = useState(null as MedicalRecord | null);
  const [petProfile, setPetProfile] = useState(null as PetProfile | null);

    useEffect(() => {
        fetchMedicalRecords().then((records) => {
            setRecord(records.filter((record) => record.id === Number(recordId))[0]);
        });
        fetchPetProfiles().then((petProfiles) => {
            setPetProfile(petProfiles.filter((petProfile) => petProfile.id === medicalRecord?.pet_profile_id)[0]);
        });
    }, [recordId]);
  return (
    <div className="MedicalRecords">
      <h2>Viewing Medical Record #{recordId}</h2>
      <p>Record ID: {recordId}</p>
    </div>
  );
}

export default ViewRecord;