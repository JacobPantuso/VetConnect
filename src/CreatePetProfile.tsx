import React, { useState } from 'react';
import { useUserSession, addPetProfile, PetProfile } from './utils/supabase';
import './styles/CreatePetProfile.css';
import { Link, useNavigate } from 'react-router-dom';
import SearchTags from './components/SearchTags';
import { traits, allergies, vaccinations, InfoBubbleValues } from './components/InfoBubbles';

function ArrowSvg() {
    const fillColor: string = "#D5DDDF";

    return (
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill={fillColor} d="M8.62813 19.625L20.5281 31.525L17.5 34.5L0.5 17.5L17.5 0.5L20.5281 3.475L8.62813 15.375H34.5V19.625H8.62813Z" />
        </svg>
    );
}

function FolderBackground() {
    return (
        <svg width="100%" height="100%" viewBox="0 0 1139 715" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1138.5 52V708.5C1138.5 711.538 1136.04 714 1133 714H6.00002C2.96245 714 0.5 711.538 0.5 708.5V58C0.5 54.9624 2.96244 52.5 6 52.5H341.606H486.467C488.316 52.5 490.078 51.7122 491.311 50.3338L534.252 2.33297C535.296 1.16663 536.786 0.5 538.351 0.5H858.009H998.035H1021.53H1133C1136.04 0.5 1138.5 2.96243 1138.5 6V52Z" fill="none" stroke="#3c3e3c" />
        </svg>
    );
}

function CrossSvg() {
    return (
        <svg className='crossSvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.5 1.5L1.5 18.5M1.5 1.5L18.5 18.5" className='crossSvg' strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function AddSvg() {
    return (
        <svg width="23" height="23" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
            <path className='addSvg' d="M10.375 17.125H12.625V12.625H17.125V10.375H12.625V5.875H10.375V10.375H5.875V12.625H10.375V17.125ZM11.5 22.75C9.94375 22.75 8.48125 22.4594 7.1125 21.8781C5.74375 21.2781 4.55313 20.4719 3.54063 19.4594C2.52813 18.4469 1.72188 17.2562 1.12188 15.8875C0.540625 14.5187 0.25 13.0562 0.25 11.5C0.25 9.94375 0.540625 8.48125 1.12188 7.1125C1.72188 5.74375 2.52813 4.55312 3.54063 3.54062C4.55313 2.52812 5.74375 1.73125 7.1125 1.15C8.48125 0.55 9.94375 0.25 11.5 0.25C13.0563 0.25 14.5188 0.55 15.8875 1.15C17.2563 1.73125 18.4469 2.52812 19.4594 3.54062C20.4719 4.55312 21.2688 5.74375 21.85 7.1125C22.45 8.48125 22.75 9.94375 22.75 11.5C22.75 13.0562 22.45 14.5187 21.85 15.8875C21.2688 17.2562 20.4719 18.4469 19.4594 19.4594C18.4469 20.4719 17.2563 21.2781 15.8875 21.8781C14.5188 22.4594 13.0563 22.75 11.5 22.75ZM11.5 20.5C14.0125 20.5 16.1406 19.6281 17.8844 17.8844C19.6281 16.1406 20.5 14.0125 20.5 11.5C20.5 8.9875 19.6281 6.85938 17.8844 5.11562C16.1406 3.37187 14.0125 2.5 11.5 2.5C8.9875 2.5 6.85938 3.37187 5.11562 5.11562C3.37187 6.85938 2.5 8.9875 2.5 11.5C2.5 14.0125 3.37187 16.1406 5.11562 17.8844C6.85938 19.6281 8.9875 20.5 11.5 20.5Z" />
        </svg>
    );
}


interface InfoBubbleProps {
    value: string,
    color?: string
    onClick: Function,
    index?: number,
};

function TraitInfoBubble({ value, color, onClick }: InfoBubbleProps) {
    return (
        <div className='petCreationInfoBubble'>
            <div className='petCreationInfoBubbleTitle'>
                <h2>{value}</h2>
            </div>
            <div className='petCreationInfoBubbleCross' onClick={() => onClick(value)}>
                <CrossSvg />
            </div>
        </div>
    );
}


function InfoBubble({ value, color, onClick }: InfoBubbleProps) {
    return (
        <div className='petCreationInfoBubbleVA'>
            <div className='petCreationInfoBubbleTitleVA'>
                <h2>{value}</h2>
            </div>
            <div className='petCreationInfoBubbleCrossVA' onClick={() => onClick(value)}>
                <CrossSvg />
            </div>
        </div>
    );
}

interface AddBubbleProps {
    value: string,
    color?: string
    onClick: Function,
    onMouseDown: Function,
    title: string,
};

function AddBubble({ value, color, onClick, title, onMouseDown }: AddBubbleProps) {
    return (
        <div className='petCreationAddBubble' onMouseDown={(e) => { onMouseDown(e); onClick(title) }}>
            <div className='petCreationAddBubbleIcon'>
                <AddSvg />
            </div>
            <div className='petCreationAddBubbleTitle'>
                <h2>{value}</h2>
            </div>
        </div>
    )
}

interface NewPetProfile {
    id?: number;
    name?: string;
    owner_id?: string;    
    species?: string;
    breed: string;
    date_of_birth?: string;
    gender: "male" | "female" | "unknown";
    weight?: number;
    height?: number;
    traits?: string[];
    vaccinations?: string[];
    allergies?: string[];
};

function CreatePetProfile() {
    const { user, fetching } = useUserSession();
    let navigate = useNavigate();
    const [selectedTraits, setSelectedTraits] = useState<InfoBubbleValues>(traits);
    const [selectedVaccinations, setSelectedVaccinations] = useState<InfoBubbleValues>(vaccinations);
    const [selectedAllergies, setSelectedAllergies] = useState<InfoBubbleValues>(allergies);
    const selectedTraitsList = Object.entries(selectedTraits);

    const defaultNewPetProfile: NewPetProfile = {
        name: "",
        species: "",
        breed: "",
        gender: "male",
        traits: [],
        vaccinations: [],
        allergies: [],
    }
    const [newPetProfile, setNewPetProfile] = useState<NewPetProfile>(defaultNewPetProfile);


    function getTrueTraitPairs() {
        let trueTraits: any = [];
        for (let i = 0; i < selectedTraitsList.length; i++) {
            if (selectedTraitsList[i][1]) {
                trueTraits.push(selectedTraitsList[i]);
            }
        }
        var truePairs = [];
        for (var i = 0; i < trueTraits.length; i += 2) {
            if (trueTraits[i + 1] !== undefined) {
                truePairs.push([trueTraits[i], trueTraits[i + 1]]);
            } else {
                truePairs.push([trueTraits[i]]);
            }
        }
        return truePairs;
    }

    var truePairs = getTrueTraitPairs();
    const [openedMenu, setOpenedMenu] = useState<string>("None");
    const [mousePosition, setMousePosition] = useState<number[]>([0, 0]);

    const handleNewPetProfileChange = (type: string, newValue: any) => {
        let updatedPetProfile = { ...newPetProfile };
        console.log(newValue);
        if (type === "name") {
            updatedPetProfile.name = newValue;
        } else if (type === "species") {
            updatedPetProfile.species = newValue;
        } else if (type === "breed") {
            updatedPetProfile.breed = newValue;
        } else if (type === "weight") {
            updatedPetProfile.weight = Number(newValue);
        } else if (type === "height") {
            updatedPetProfile.height = Number(newValue);
        } else if (type === "dateOfBirth") {
            updatedPetProfile.date_of_birth = newValue;
        } else if (type === "gender") {
            updatedPetProfile.gender = newValue;
        } else if (type === "traits") {
            const traitsList = Object.entries(newValue);
            const updatedTraits = [];
            for (let i = 0; i < traitsList.length; i++) {
                if (traitsList[i][1]) {
                    updatedTraits.push(traitsList[i][0])
                }
            }
            updatedPetProfile.traits = updatedTraits;

        } else if (type === "vaccinations") {
            const vaccinationsList = Object.entries(newValue);
            const updatedVaccinations = [];
            for (let i = 0; i < vaccinationsList.length; i++) {
                if (vaccinationsList[i][1]) {
                    updatedVaccinations.push(vaccinationsList[i][0])
                }
            }
            updatedPetProfile.vaccinations = updatedVaccinations;

        } else if (type === "allergies") {
            const allergiesList = Object.entries(newValue);
            const updatedAllergies = [];
            for (let i = 0; i < allergiesList.length; i++) {
                if (allergiesList[i][1]) {
                    updatedAllergies.push(allergiesList[i][0])
                }
            }
            updatedPetProfile.allergies = updatedAllergies;
        }

        setNewPetProfile(updatedPetProfile);
    }

    const handleOpenMenu = async (title: string) => {
        let newOpenedMenu = openedMenu;
        if (newOpenedMenu === title) {
            newOpenedMenu = "None";
        } else {
            newOpenedMenu = title;
        }
        setOpenedMenu(newOpenedMenu);
    };

    const GetMousePosition = (e: any) => {
        let newMousePosition: number[] = [0, 0];
        newMousePosition[0] = e.clientX;
        newMousePosition[1] = e.clientY;
        setMousePosition(newMousePosition);
    };

    const handleSelectTraits = (key: string) => {
        let newTraits = { ...selectedTraits };
        newTraits[key] = !newTraits[key];
        setSelectedTraits(newTraits);
        handleNewPetProfileChange("traits", newTraits);
    };

    const handleSelectVaccinations = (key: string) => {
        let newVaccinations = { ...selectedVaccinations };
        newVaccinations[key] = !newVaccinations[key];
        setSelectedVaccinations(newVaccinations);
        handleNewPetProfileChange("vaccinations", newVaccinations);
    };

    const handleSelectAllergies = (key: string) => {
        let newAllergies = { ...selectedAllergies };
        newAllergies[key] = !selectedAllergies[key];
        setSelectedAllergies(newAllergies);
        handleNewPetProfileChange("allergies", newAllergies);
    };

    const createPet = async () => {
        let savePetProfile: NewPetProfile = {...newPetProfile}

        if (user) {
            savePetProfile.owner_id = user?.id;
            if (savePetProfile.name && savePetProfile.species && savePetProfile.date_of_birth && savePetProfile.weight &&  savePetProfile.height && savePetProfile.traits && savePetProfile.vaccinations && savePetProfile.allergies) {
                await addPetProfile({
                    owner_id: savePetProfile.owner_id,
                    breed: savePetProfile.breed,
                    species: savePetProfile.species,
                    name: savePetProfile.name,
                    date_of_birth: savePetProfile.date_of_birth, 
                    gender: savePetProfile.gender,
                    weight: savePetProfile.weight,
                    height: savePetProfile.height,
                    traits: savePetProfile.traits, 
                    vaccinations: savePetProfile.vaccinations,
                    allergies: savePetProfile.allergies
                });
                navigate("/mypets");
            }
        }
    }

    if (fetching) {
        return (
            <div style={{height: '100%', margin: 'auto'}}>
                <section className='MyPets'>
                <div className="myPetsTitle">
                    <h1>
                    My Pets
                    </h1>
                </div>
        
        
                <div className='petContainer'>
                    <div className="petList">
                    <div className='loader' style={{scale: "1.5"}}></div>
                    </div>
                </div>
        
        
        
                <div className='manageProfiles'>
                    <p className='loading' style={{ width: '300px' }}></p>
                </div>
                </section>
            </div>
            );
    }

    return (
        <section className='createPetProfile'>
            <section className='createPetProfileTitle'>
                <div className='backSection'>
                    <Link to={"/mypets"}>
                        <ArrowSvg />
                    </Link>
                    <h1>Create a Pet Profile</h1>
                </div>
            </section>

            <section className='fillInSection' >
                <FolderBackground />
                <div className='petCreationContainer'>
                    <div className='petCreationColumn1'>
                        <div className='petName'>
                            <h2>Name:</h2>
                            <input type="text" onChange={(e) => (handleNewPetProfileChange("name", e.currentTarget.value))}></input>
                        </div>

                        <div className='petSpecies'>
                            <h2>Species:</h2>
                            <input type="text" onChange={(e) => (handleNewPetProfileChange("species", e.currentTarget.value))}></input>
                        </div>

                        <div className='petSpecies'>
                            <h2>Breed:</h2>
                            <input type="text" onChange={(e) => (handleNewPetProfileChange("breed", e.currentTarget.value))}></input>
                        </div>

                        <div className='petDOB'>
                            <h2>Date Of Birth:</h2>
                            <input type="date" onChange={(e) => (handleNewPetProfileChange("dateOfBirth", e.currentTarget.value))}></input>
                        </div>

                        <div className='petCreationTraits'>
                            <h2>Traits:</h2>
                            <div className='petCreationTraitsSection'>

                                {
                                    truePairs.map((item, i) => {
                                        const twoTraits = item.map(([key, value]) => <TraitInfoBubble key={key} onClick={handleSelectTraits} value={key} />)
                                        return (
                                            <div className='petCreationTraitsRow' key={i}>
                                                {twoTraits}
                                            </div>
                                        );
                                    })
                                }
                                <div className='petCreationTraitsRow'>
                                    <AddBubble onMouseDown={GetMousePosition} onClick={handleOpenMenu} title={"Traits"} value="Add Trait" />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='petCreationColumn2'>
                        <div className='petCreationRow'>

                            <div className='petGender'>
                                <h2>Gender:</h2>
                                <select className='petGender' onChange={(e) => (handleNewPetProfileChange("gender", e.currentTarget.value))}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <div className='petWeight'>
                                <h2>Weight:</h2>
                                <div className='weightSuffix'>
                                    <input type="number" onChange={(e) => (handleNewPetProfileChange("weight", e.currentTarget.value))}></input>
                                </div>
                            </div>

                            <div className='petHeight'>
                                <h2>Height:</h2>
                                <div className='heightSuffix'>
                                    <input type="number" onChange={(e) => (handleNewPetProfileChange("height", e.currentTarget.value))}></input>
                                </div>
                            </div>
                        </div>

                        <div className='petCreationRow2'>
                            <div className='petCreationVaccinations'>
                                <h2>Vaccinations:</h2>
                                <div className='petCreationVaccinationContainer'>
                                    {Object.entries(selectedVaccinations).map(([key, value]) => {
                                        if (value) {
                                            return (
                                                <InfoBubble key={key} onClick={handleSelectVaccinations} value={key} />
                                            );
                                        }
                                    })}
                                    <AddBubble onMouseDown={GetMousePosition} onClick={handleOpenMenu} title={"Vaccinations"} value='Add Vaccination' />
                                </div>
                            </div>
                            <div className='petCreationAllergies'>
                                <h2>Allergies:</h2>
                                <div className='petCreationVaccinationContainer'>
                                    {Object.entries(selectedAllergies).map(([key, value]) => {
                                        if (value) {
                                            return (
                                                <InfoBubble key={key} onClick={handleSelectAllergies} value={key} />
                                            );
                                        }
                                    })}
                                    <AddBubble onMouseDown={GetMousePosition} onClick={handleOpenMenu} title={"Allergies"} value='Add Allergy' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className='saveButton'>
                <input className='saveButton' type="button" value="Save" onClick={() => { createPet() }} />
            </div>


            {openedMenu === "Traits" && <SearchTags mousePosition={mousePosition} buttons={selectedTraits} setSelectedButtons={handleSelectTraits} />}
            {openedMenu === "Vaccinations" && <SearchTags mousePosition={mousePosition} buttons={selectedVaccinations} setSelectedButtons={handleSelectVaccinations} />}
            {openedMenu === "Allergies" && <SearchTags mousePosition={mousePosition} buttons={selectedAllergies} setSelectedButtons={handleSelectAllergies} />}

        </section>
    );
}

export default CreatePetProfile;