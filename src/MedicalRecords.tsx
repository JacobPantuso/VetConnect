import React, {useEffect, useState} from "react";
import { useUserSession, fetchAllUsers, fetchPetProfiles, User, PetProfile, MedicalRecord, fetchMedicalRecords } from "./utils/supabase";
import { useNavigate } from "react-router-dom";
import "./styles/MedicalRecords.css";

function MedicalRecords() {
    const { user, fetching } = useUserSession();
    const [users, setAllUsers] = useState([] as User[]);
    const [selectedUser, setSelectedUser] = useState(null as User | null);
    const [petProfiles, setPetProfiles] = useState([] as any[]);
    const [selectedPetProfile, setSelectedPetProfile] = useState(null as PetProfile | null);
    const [medicalRecords, setMedicalRecords] = useState([] as MedicalRecord[]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (user?.user_type !== 'USER') {
          fetchAllUsers().then((users) => {
            setAllUsers(users);
          });
        }
      }, [user])

    if (fetching) {
        return (
            <div className="MedicalRecords">
                <h2>Medical Records</h2>
                <p className="loading" style={{width: '300px'}}></p>
            </div>
        );
    }

    if (user?.user_type === 'USER') {
        navigate('/');
    }

    const handleUserSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUser = users.filter((user) => user.id === e.target.value)[0];
      
        if (!selectedUser) {
          console.error("User not found");
          return;
        }
        setSelectedUser(selectedUser);
        try {
          const [petProfiles] = await Promise.all([
            fetchPetProfiles(selectedUser.id)
          ]);

            setPetProfiles(petProfiles);

        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    
    const handlePetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPetProfile = petProfiles.filter((petProfile) => petProfile.id === Number(e.target.value))[0];

        if (!selectedPetProfile) {
          console.error("Pet Profile not found");
          return;
        }
        setLoading(true);
        setSelectedPetProfile(selectedPetProfile);

        fetchMedicalRecords(selectedUser?.id).then((medicalRecords) => {
            setMedicalRecords(medicalRecords.filter((record) => record.pet_profile_id === selectedPetProfile.id));
        });
        setLoading(false);
    }
    

    return (
        <div className="MedicalRecords">
            <h2>Medical Records</h2>
            <p style={{marginBottom: "1rem"}}>Select a customer and pet to view their medical records.</p>
            <div className="select-row">
                <select className='user-select'  onChange={(e) => { handleUserSelect(e) }}>
                    <option value=''>Select a customer</option>
                    {users.map((user) => (
                        user.user_type === 'USER' && (<option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>)
                    ))}
                </select>
                {petProfiles.length > 0 && (
                    <select className="user-select" onChange={(e) => {handlePetSelect(e)}}>
                        <option value=''>Select a pet</option>
                        {petProfiles.map((petProfile) => (
                            <option key={petProfile.id} value={petProfile.id}>{petProfile.name}</option>
                        ))}
                    </select>
                )}
            </div>
            {loading ?
            <div className="loading-records">
                <div className="loader"></div>
                <p>Fetching Medical Records</p>
            </div>
            :
            medicalRecords.length > 0 && (
                    <div className="medical-records-selection">
                        <h3>Medical Records for {selectedPetProfile?.name}</h3>
                        <div className="records-container">
                            {medicalRecords.map((record) => (
                                <div key={record.id} className="record" onClick={() => navigate(`/medicalrecords/${record.id}`)}>
                                    <div className="record-content">
                                        <h4>{new Date(new Date(record.date).getTime() + new Date(record.date).getTimezoneOffset() * 60000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                                        <p>{selectedPetProfile?.name} | {selectedPetProfile?.breed}</p>
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default MedicalRecords;