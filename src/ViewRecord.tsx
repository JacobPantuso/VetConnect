import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAllUsers, fetchMedicalRecords, fetchPetProfiles, MedicalRecord, PetProfile, updateMedicalRecord, User } from "./utils/supabase";
import PetProfileIcon from "./components/PetProfileIcon";
import './styles/ViewMedicalRecord.css';
import EditButton from "./components/EditButton";
import SearchTags from "./components/SearchTags";
import { InfoBubbleValues, symptoms } from "./components/InfoBubbles";

function AddIconSvg() {
  return (
    <svg className='editIcons' width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.6666 20.6666H15.3333V15.3333H20.6666V12.6666H15.3333V7.33329H12.6666V12.6666H7.33329V15.3333H12.6666V20.6666ZM14 27.3333C12.1555 27.3333 10.4222 26.9888 8.79996 26.3C7.17774 25.5888 5.76663 24.6333 4.56663 23.4333C3.36663 22.2333 2.41107 20.8222 1.69996 19.2C1.01107 17.5777 0.666626 15.8444 0.666626 14C0.666626 12.1555 1.01107 10.4222 1.69996 8.79996C2.41107 7.17774 3.36663 5.76662 4.56663 4.56663C5.76663 3.36662 7.17774 2.42218 8.79996 1.73329C10.4222 1.02218 12.1555 0.666626 14 0.666626C15.8444 0.666626 17.5777 1.02218 19.2 1.73329C20.8222 2.42218 22.2333 3.36662 23.4333 4.56663C24.6333 5.76662 25.5777 7.17774 26.2666 8.79996C26.9777 10.4222 27.3333 12.1555 27.3333 14C27.3333 15.8444 26.9777 17.5777 26.2666 19.2C25.5777 20.8222 24.6333 22.2333 23.4333 23.4333C22.2333 24.6333 20.8222 25.5888 19.2 26.3C17.5777 26.9888 15.8444 27.3333 14 27.3333ZM14 24.6666C16.9777 24.6666 19.5 23.6333 21.5666 21.5666C23.6333 19.5 24.6666 16.9777 24.6666 14C24.6666 11.0222 23.6333 8.49996 21.5666 6.43329C19.5 4.36663 16.9777 3.33329 14 3.33329C11.0222 3.33329 8.49996 4.36663 6.43329 6.43329C4.36663 8.49996 3.33329 11.0222 3.33329 14C3.33329 16.9777 4.36663 19.5 6.43329 21.5666C8.49996 23.6333 11.0222 24.6666 14 24.6666Z" />
    </svg>
  );
}

function CrossSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.5 1.5L1.5 18.5M1.5 1.5L18.5 18.5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowSvg() {
  const fillColor: string = "#D5DDDF";
  return (
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill={fillColor} d="M8.62813 19.625L20.5281 31.525L17.5 34.5L0.5 17.5L17.5 0.5L20.5281 3.475L8.62813 15.375H34.5V19.625H8.62813Z" />
    </svg>
  );
}

interface SymptomBubbleProps {
  value: string;
  isEditing: boolean;
  onDelete: Function;
}

function SymptomBubble({ value, isEditing, onDelete }: SymptomBubbleProps) {
  return (
    <div className="symptomBubble">
      <div className="symptomBubbleValue">
        <h2>{value}</h2>
      </div>
      <div className="center">
        {isEditing && <div style={{display: 'flex', justifyContent: 'center'}} onClick={()=> {onDelete(value)}}><CrossSvg/></div>}
      </div>
    </div>
  );
}

function ViewRecord() {
  const { recordId } = useParams();
  const [medicalRecord, setRecord] = useState(null as MedicalRecord | null);
  const [petProfile, setPetProfile] = useState(null as PetProfile | null);
  const [owner, setOwner] = useState<null | User>();
  const [vet, setVet] = useState<null | User>();

  //Modifying Records
  const [isEditing, setIsEditing] = useState(false);

  //Notes
  const [notes, setNotes] = useState<string>("");

  //Symptoms
  const [openedMenu, setOpenedMenu] = useState<string>("None");
  const [mousePosition, setMousePosition] = useState<number[]>([0, 0]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<InfoBubbleValues>(symptoms);


  const handleDoneButton = async () => {
    setOpenedMenu('None');
    let newSymptoms: string[] = [];
    Object.entries(selectedSymptoms).forEach(([symptoms, bool]) => {
      if (bool) {
        newSymptoms.push(symptoms);
      }
    })

    if (medicalRecord) {
      let updatedMedicalRecord = {...medicalRecord};
      updatedMedicalRecord.symptoms = newSymptoms;
      updatedMedicalRecord.notes = notes;
      setRecord(updatedMedicalRecord);
      updateMedicalRecord(medicalRecord.id, updatedMedicalRecord);
    }
  }

  const handleSelectedSymptoms = (key: string) => {
    let newSymptoms = { ...selectedSymptoms };
    newSymptoms[key] = !newSymptoms[key];
    setSelectedSymptoms(newSymptoms);
  };

  useEffect(() => {
    fetchMedicalRecords().then((records) => {
      setRecord(records.filter((record) => record.id === Number(recordId))[0]);
    });
  }, [recordId]);


  useEffect(() => {
    fetchPetProfiles(medicalRecord?.owner_id).then((petProfiles) => {
      setPetProfile(petProfiles.filter((petProfile) => petProfile.id === medicalRecord?.pet_profile_id)[0]);
    });
    fetchAllUsers().then((users) => {
      setOwner(users.filter((user) => user.id === medicalRecord?.owner_id)[0]);
      setVet(users.filter((user) => user.id === medicalRecord?.veterinarian_id)[0]);
    })

    if (medicalRecord) {
      let newSymptoms = { ...selectedSymptoms };
      medicalRecord.symptoms.forEach((symptom) => {
        newSymptoms[symptom] = true;
      })
      setNotes(medicalRecord.notes);
      setSelectedSymptoms(newSymptoms);
    }

  }, [medicalRecord]);

  const GetMousePosition = (e: any) => {
    let newMousePosition: [number, number] = [0, 0];
    newMousePosition[0] = e.clientX;
    newMousePosition[1] = e.clientY;
    setMousePosition(newMousePosition);
  };

  const handleOpenMenu = async (title: string) => {
    let newOpenedMenu = openedMenu;
    if (newOpenedMenu === title) {
      newOpenedMenu = "None";
    } else {
      newOpenedMenu = title;
    }

    setOpenedMenu(newOpenedMenu);
  };


  return (
    <div className="ViewMedicalRecord">
      <section className='title'>
        <div className='backSection'>
          <Link to={"/medicalrecords"}>
            <ArrowSvg />
          </Link>
          <h1>Medical Record #{recordId}</h1>
        </div>
        <div className='editSection'>
          <EditButton isEditing={isEditing} onClickDone={handleDoneButton} setIsEditing={setIsEditing} value='Edit Medical Record' />
        </div>
      </section>

      <section className='petInfo'>
        <section className='petRow petRow1'>
          <div className='petTitle greyBorder'>
            <div>
              {petProfile && <PetProfileIcon petProfile={petProfile} size='6em' />}
            </div>
            <div>
              {petProfile &&
                <h2 className='petGenderAge'>{petProfile.gender}, {Math.floor((Math.abs(Date.now() - new Date(petProfile.date_of_birth).getTime()) / (1000 * 3600 * 24)) / 365.25)}</h2>
              }
              <h1>{petProfile?.name}</h1>
              <Link to={`/petprofile/${petProfile?.id}`}><h3>View Pet Profile</h3></Link>
            </div>
          </div>
          <div className='petStats greyBorder'>

            <div className='stringStat'>
              <h2>Owner</h2>
              <h1>{owner?.first_name} {owner?.last_name}</h1>
            </div>

            <div className='stringStat'>
              <h2>Doctor</h2>
              <h1>Dr.{vet?.last_name}</h1>
            </div>

            <div className='stringStat'>
              <h2>Date</h2>
              <h1>{medicalRecord?.date}</h1>
            </div>

          </div>
        </section>

        <section className='petRow petRow2' style={{ marginBottom: '5em' }}>
          <div className="medicalSymptoms greyBorder">
            <h2>Symptoms</h2>
            <div className="medicalRecordsContainer medicalRecordsContainerScroll">
              <div className="medicalRecordsScroll">
                {Object.entries(selectedSymptoms).map(([symptom, bool]) => {
                  if (bool) {
                    return (
                      <SymptomBubble key={symptom} value={symptom} isEditing={isEditing} onDelete={handleSelectedSymptoms} />
                    );
                  }
                })
                }
              </div>
            </div>
            {isEditing &&
              <div className='editIcons'>
                <div className='addButtonSvg' onMouseDown={(e) => { GetMousePosition(e); handleOpenMenu("Symptoms") }}>
                  <AddIconSvg />
                </div>
              </div>
            }
          </div>
          <div className="medicalNotes greyBorder">
            <h2>Notes</h2>
            {isEditing ?
              <textarea placeholder="Write Notes here..." onChange={(e)=>setNotes(e.currentTarget.value)} value={notes} className="medicalRecordsContainer greyBorder" />
              :
              <textarea placeholder="Write Notes here..." value={notes} disabled className="medicalRecordsContainer greyBorder" />
            }
          </div>
        </section>
      </section>

      {openedMenu === "Symptoms" && <SearchTags mousePosition={mousePosition} buttons={selectedSymptoms} setSelectedButtons={handleSelectedSymptoms} />}


    </div>
  );
}

export default ViewRecord;