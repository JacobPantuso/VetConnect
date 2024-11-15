import React, { useState } from 'react';
import { useUserSession } from './utils/supabase';
import './styles/PetProfile.css';
import PetProfileIcon from './components/PetProfileIcon';
import { PetProfileProps } from './MyPets';
import EditButton from './components/EditButton';
import { Link } from 'react-router-dom';

//Default value
const petProfile: PetProfileProps = {
    petProfileId: 1,
    petProfileName: "Sparky",
    petProfileOwner: "Noah"
};

function ArrowSvg() {
    return (
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.62813 19.625L20.5281 31.525L17.5 34.5L0.5 17.5L17.5 0.5L20.5281 3.475L8.62813 15.375H34.5V19.625H8.62813Z" fill="white" />
        </svg>
    );
}

function PetTitle() {
    return (
        <div className='petTitle'>
            <div>
                <PetProfileIcon petProfile={petProfile} size='6em' />
            </div>

            <div>
                <h2 className='petGenderAge'>Male, 6</h2>
                <h1>Pet_Name</h1>
            </div>
        </div>
    );
}

function PetStats() {
    return (
        <div className='petStats'>
            <div className='stringStat'>
                <h2>Species</h2>
                <h1>Golden Retriever</h1>
            </div>
            <div className='numberStat'>
                <h2>Weight</h2>
                <div className='numberUnit'>
                    <h1>31.2</h1>
                    <h3>kg</h3>
                </div>

            </div>
            <div className='numberStat'>
                <h2>Height</h2>
                <div className='numberUnit'>
                    <h1>23.1</h1>
                    <h3>in</h3>
                </div>
            </div>
        </div>
    );
}


function PetVisits() {
    return (
        <div className='petVisits'>
            <h2>Visits</h2>
            <div className='appointments'>

            </div>
        </div>

    );
}

function PetAllergies() {
    return (
        <div className='petAllergies'>
            <h2>Allergies</h2>
        </div>
    );
}

function PetVaccinations() {
    return (
        <div className='petVaccinations'>
            <h2>Vaccinations</h2>
        </div>
    );
}


function PetTraits() {
    return (
        <div className='petTraits'>
            <h2>Traits</h2>
        </div>
    );
}


function PetProfile() {
    const { user, fetching } = useUserSession();
    const [isEditing, setIsEditing] = useState(false);

    if (fetching) {
        return (
            <div>

            </div>
        );
    }

    return (
        <section className='petProfile'>
            <section className='title'>
                <div className='backSection'>
                    <Link to={"/mypets"}>
                        <ArrowSvg />
                    </Link>
                    <h1>My Pets</h1>
                </div>
                <div className='editSection'>
                    <EditButton isEditing={isEditing} setIsEditing={setIsEditing} value='Edit Pet Profile' />
                </div>
            </section>
            <section className='petInfo'>
                <section className='petRow'>
                    <PetTitle />
                    <PetStats />
                </section>

                <section className='petRow'>
                    <PetVisits />
                    <PetAllergies />
                    <PetVaccinations />
                    <PetTraits />
                </section>
            </section>
        </section>
    );
}

export default PetProfile;