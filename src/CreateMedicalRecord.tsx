import { Link, useNavigate, useParams } from 'react-router-dom';
import './styles/CreateMedicalRecord.css'
import SearchTags from './components/SearchTags';
import { useEffect, useState } from 'react';
import { InfoBubbleValues, symptoms } from './components/InfoBubbles';
import { fetchAllUsers, fetchPetProfiles, PetProfile, User, addMedicalRecord, useUserSession } from './utils/supabase';

function FolderBackground() {
    return (
        <svg width="100%" height="100%" viewBox="0 0 1139 715" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1138.5 52V708.5C1138.5 711.538 1136.04 714 1133 714H6.00002C2.96245 714 0.5 711.538 0.5 708.5V58C0.5 54.9624 2.96244 52.5 6 52.5H341.606H486.467C488.316 52.5 490.078 51.7122 491.311 50.3338L534.252 2.33297C535.296 1.16663 536.786 0.5 538.351 0.5H858.009H998.035H1021.53H1133C1136.04 0.5 1138.5 2.96243 1138.5 6V52Z" fill="none" stroke="#3c3e3c" />
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

function AddSvg() {
    return (
        <svg width="30" height="30" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
            <path className='addSvg' d="M10.375 17.125H12.625V12.625H17.125V10.375H12.625V5.875H10.375V10.375H5.875V12.625H10.375V17.125ZM11.5 22.75C9.94375 22.75 8.48125 22.4594 7.1125 21.8781C5.74375 21.2781 4.55313 20.4719 3.54063 19.4594C2.52813 18.4469 1.72188 17.2562 1.12188 15.8875C0.540625 14.5187 0.25 13.0562 0.25 11.5C0.25 9.94375 0.540625 8.48125 1.12188 7.1125C1.72188 5.74375 2.52813 4.55312 3.54063 3.54062C4.55313 2.52812 5.74375 1.73125 7.1125 1.15C8.48125 0.55 9.94375 0.25 11.5 0.25C13.0563 0.25 14.5188 0.55 15.8875 1.15C17.2563 1.73125 18.4469 2.52812 19.4594 3.54062C20.4719 4.55312 21.2688 5.74375 21.85 7.1125C22.45 8.48125 22.75 9.94375 22.75 11.5C22.75 13.0562 22.45 14.5187 21.85 15.8875C21.2688 17.2562 20.4719 18.4469 19.4594 19.4594C18.4469 20.4719 17.2563 21.2781 15.8875 21.8781C14.5188 22.4594 13.0563 22.75 11.5 22.75ZM11.5 20.5C14.0125 20.5 16.1406 19.6281 17.8844 17.8844C19.6281 16.1406 20.5 14.0125 20.5 11.5C20.5 8.9875 19.6281 6.85938 17.8844 5.11562C16.1406 3.37187 14.0125 2.5 11.5 2.5C8.9875 2.5 6.85938 3.37187 5.11562 5.11562C3.37187 6.85938 2.5 8.9875 2.5 11.5C2.5 14.0125 3.37187 16.1406 5.11562 17.8844C6.85938 19.6281 8.9875 20.5 11.5 20.5Z" />
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

interface SymptomBubbleProps {
    value: string;
    onDelete: Function;
}

//{isEditing && <div style={{display: 'flex', justifyContent: 'center'}} onClick={()=> {onDelete(value)}}><CrossSvg/></div>}
function SymptomBubble({ value, onDelete }: SymptomBubbleProps) {
    return (
        <div className="symptomBubble">
            <div className="symptomBubbleValue">
                <h2>{value}</h2>
            </div>
            <div className="center">
                <div style={{ display: 'flex', justifyContent: 'center' }} onClick={() => { onDelete(value) }}><CrossSvg /></div>

            </div>
        </div>
    );
}

function CreateMedicalRecord() {
    const { petId } = useParams();
    const { user, fetching } = useUserSession();
    const navigate = useNavigate();
    const [owner, setOwner] = useState<null | User>();
    const [petProfile, setPetProfile] = useState<PetProfile | null>();

    //Symptoms
    const [openedMenu, setOpenedMenu] = useState<string>("None");
    const [mousePosition, setMousePosition] = useState<number[]>([0, 0]);
    const [selectedSymptoms, setSelectedSymptoms] = useState<InfoBubbleValues>(symptoms);

    //Notes
    const [notes, setNotes] = useState<string>("");

    useEffect(() => {
        if (petId) {
            fetchPetProfiles().then((petProfiles) => {
                const petProfile = petProfiles.filter((petProfile) => petProfile.id === Number(petId))[0]
                setPetProfile(petProfile);
                fetchAllUsers().then((users) => {
                    const user = users.filter((owner) => owner.id === petProfile.owner_id)[0];
                    setOwner(user);
                })
            })
        }
    }, [petId]);

    const handleSelectedSymptoms = (key: string) => {
        let newSymptoms = { ...selectedSymptoms };
        newSymptoms[key] = !newSymptoms[key];
        setSelectedSymptoms(newSymptoms);
    };

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

    const handleMedicalRecordCreation = async () => {
        if (notes && user && petProfile && owner) {
            let symptoms: string[] = [];
            Object.entries(selectedSymptoms).forEach(([symptom, bool]) => {
                if (bool) {
                    symptoms.push(symptom);
                }
            })

            const record = await addMedicalRecord({
                owner_id: owner.id,
                date: new Date().toISOString().split('T')[0],
                veterinarian_id: user.id,
                pet_profile_id: petProfile.id,
                notes: notes,
                symptoms: symptoms,
            }).then((id)=> {
                navigate(`/medicalrecords/${id}`);
            })

            
            
        }
    }

    return (
        <>
        {openedMenu === "Symptoms" && <SearchTags mousePosition={mousePosition} buttons={selectedSymptoms} setSelectedButtons={handleSelectedSymptoms} />}
        <div className="createMedicalRecord">
            <section className='createMedicalRecordTitle'>
                <div className='backSection'>
                    <Link to={"/medicalrecords"}>
                        <ArrowSvg />
                    </Link>
                    <h1>Create Medical Record</h1>
                </div>
            </section>          

            <section className='createMedicalRecordContainer' >
                <div className='folderSvg'>
                    <FolderBackground />
                    <div className='saveButtonRecord'>
                        <input className='saveButton' type="button" value="Save" onClick={() => { handleMedicalRecordCreation() }} />
                    </div>
                    <div className='medicalRecordsFiller'>
                        <div className='creationRow creationRow1'>
                            <div className='createRecordInfo patient'>
                                <h2>Patient:</h2>
                                {owner ?
                                    <input type='text' disabled value={`${owner?.first_name} ${owner?.last_name}`} /> :
                                    <input type='text' disabled value={``} />
                                }
                            </div>

                            <div className='createRecordInfo petname'>
                                <h2>Pet Name:</h2>
                                {petProfile ?
                                    <input type='text' disabled value={petProfile.name} /> :
                                    <input type='text' disabled value={``} />
                                }
                            </div>

                            <div className='createRecordInfo date'>
                                <h2>Date:</h2>
                                <input type='text' disabled value={new Date().toDateString()} />
                            </div>
                        </div>

                        <div className='creationRow'>
                            <div className="medicalSymptoms greyBorder">
                                <h2>Symptoms:</h2>
                                <div className="medicalRecordsContainer medicalRecordsContainerScroll">
                                    <div className="medicalRecordsScroll">
                                        {Object.entries(selectedSymptoms).map(([symptom, bool]) => {
                                            if (bool) {
                                                return (
                                                    <SymptomBubble key={symptom} value={symptom} onDelete={handleSelectedSymptoms} />
                                                );
                                            }
                                        })
                                        }
                                        <div className='addSymptom' onMouseDown={(e) => { GetMousePosition(e); handleOpenMenu("Symptoms") }}>
                                            <AddSvg />
                                            <h2>
                                                Add a Symptom
                                            </h2>

                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="medicalNotes greyBorder">
                                <h2>Notes:</h2>
                                <textarea placeholder="Write Notes here..." className="medicalRecordsContainer greyBorder" value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />
                            </div>
                        </div>

                    </div>
                </div>
            </section>


        </div>
        </>
    );
}

export default CreateMedicalRecord;