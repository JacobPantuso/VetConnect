import React, { useEffect, useState } from "react";
import { useUserSession, fetchAllUsers, fetchPetProfiles, User, PetProfile, MedicalRecord, fetchMedicalRecords } from "./utils/supabase";
import { useNavigate } from "react-router-dom";
import "./styles/MedicalRecords.css";

function AddIconSvg() {
    return (
        <svg width="40" height="40" viewBox="0 0 95 95" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="white" d="M42.7915 71.0417H52.2082V52.2084H71.0415V42.7917H52.2082V23.9583H42.7915V42.7917H23.9582V52.2084H42.7915V71.0417ZM47.4998 94.5833C40.9866 94.5833 34.8658 93.367 29.1373 90.9344C23.4089 88.4233 18.4259 85.049 14.1884 80.8115C9.95088 76.574 6.57657 71.591 4.06546 65.8625C1.63282 60.134 0.416504 54.0132 0.416504 47.5C0.416504 40.9868 1.63282 34.866 4.06546 29.1375C6.57657 23.409 9.95088 18.4261 14.1884 14.1886C18.4259 9.95106 23.4089 6.61599 29.1373 4.18335C34.8658 1.67224 40.9866 0.416687 47.4998 0.416687C54.013 0.416687 60.1339 1.67224 65.8623 4.18335C71.5908 6.61599 76.5738 9.95106 80.8113 14.1886C85.0488 18.4261 88.3839 23.409 90.8165 29.1375C93.3276 34.866 94.5832 40.9868 94.5832 47.5C94.5832 54.0132 93.3276 60.134 90.8165 65.8625C88.3839 71.591 85.0488 76.574 80.8113 80.8115C76.5738 85.049 71.5908 88.4233 65.8623 90.9344C60.1339 93.367 54.013 94.5833 47.4998 94.5833ZM47.4998 85.1667C58.0151 85.1667 66.9217 81.5177 74.2196 74.2198C81.5176 66.9219 85.1665 58.0153 85.1665 47.5C85.1665 36.9847 81.5176 28.0781 74.2196 20.7802C66.9217 13.4823 58.0151 9.83335 47.4998 9.83335C36.9846 9.83335 28.078 13.4823 20.78 20.7802C13.4821 28.0781 9.83317 36.9847 9.83317 47.5C9.83317 58.0153 13.4821 66.9219 20.78 74.2198C28.078 81.5177 36.9846 85.1667 47.4998 85.1667Z" />
        </svg>
    );
}

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
                <p className="loading" style={{ width: '300px' }}></p>
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
            <p style={{ marginBottom: "1rem" }}>Select a customer and pet to view their medical records.</p>
            <div className="select-row">
                <select className='user-select' onChange={(e) => { handleUserSelect(e) }}>
                    <option value=''>Select a customer</option>
                    {users.map((user) => (
                        user.user_type === 'USER' && (<option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>)
                    ))}
                </select>
                {petProfiles.length > 0 && (
                    <select className="user-select" onChange={(e) => { handlePetSelect(e) }}>
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
                <div className="medical-records-selection">
                    {selectedPetProfile && <h3>Medical Records for {selectedPetProfile?.name}</h3>}
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
                        {selectedPetProfile && medicalRecords.length >= 0 &&
                            <div className="add-medical-record-button" onClick={()=>{navigate(`/createmedicalrecord/${selectedPetProfile.id}`)}}>
                                <div>
                                    <AddIconSvg />
                                </div>
                                <div>
                                    Add a Medical Record
                                </div>
                            </div>
                        }

                    </div>
                </div>

            }
        </div>
    );
}

export default MedicalRecords;