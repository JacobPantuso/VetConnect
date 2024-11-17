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
    const fillColor: string = "#D5DDDF";

    return (
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill={fillColor} d="M8.62813 19.625L20.5281 31.525L17.5 34.5L0.5 17.5L17.5 0.5L20.5281 3.475L8.62813 15.375H34.5V19.625H8.62813Z" />
        </svg>
    );
}

function ClockSvg() {
    const fillColor: string = "#D5DDDF";

    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke={fillColor} d="M10.0001 4.99996V9.99996L13.3334 11.6666M18.3334 9.99996C18.3334 14.6023 14.6025 18.3333 10.0001 18.3333C5.39771 18.3333 1.66675 14.6023 1.66675 9.99996C1.66675 5.39759 5.39771 1.66663 10.0001 1.66663C14.6025 1.66663 18.3334 5.39759 18.3334 9.99996Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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

function AppointmentItem() {
    return (
        <div className='appointmentItem'>
            <h3><span className='doctorName'>Doctor_Name</span></h3>
            <div className='appointmentDate'>
                <ClockSvg />
                <h3>On October 5th</h3>
            </div>
        </div>
    );
}

function PetVisits() {
    return (
        <div className='petVisits'>
            <h2>Visits</h2>
            <div className='petProfileContainer'>
                <AppointmentItem />
                <AppointmentItem />
                <AppointmentItem />
                <AppointmentItem />
            </div>
        </div>

    );
}

export interface InfoBubbleProps {
    value: string,
    color?: string
};

function InfoBubble({ value, color }: InfoBubbleProps) {
    return (
        <div className='infoBubbleContainer'>
            <div className='infoBubble'>
                <h2>{value}</h2>
            </div>
        </div>

    );
}

export interface PetBubbleStats {
    items: string[]
};

function PetAllergies({ items }: PetBubbleStats) {
    const listItems = items.map((item) => {
        return (
            <InfoBubble value={item} />
        );
    });

    return (
        <div className='petAllergies'>
            <h2>Allergies</h2>
            <div className='petProfileContainer'>
                {listItems}
            </div>
        </div>
    );
}

function PetVaccinations({ items }: PetBubbleStats) {
    const listItems = items.map((item) => {
        return (
            <InfoBubble value={item} />
        );
    });
    
    return (
        <div className='petVaccinations'>
            <h2>Vaccinations</h2>
            <div className='petProfileContainer'>
                {listItems}
            </div>
        </div>
    );
}

function PetTraits({ items }: PetBubbleStats) {
    const listItems = items.map((item) => {
        return (
            <InfoBubble value={item} />
        );
    });

    return (
        <div className='petTraits'>
            <h2>Traits</h2>
            <div className='petProfileContainer'>
                {listItems}
            </div>
        </div>
    );
}


function PetProfile() {
    const { user, fetching } = useUserSession();
    const [isEditing, setIsEditing] = useState(false);
    let petAllergies: string[] = ["Pollen", "Dust", "Feathers", "Rubber", "Smoke"];
    let petVaccinations: string[] = ["Lyme Disease", "Canine Influenza", "Leptospirosis"];
    let petTraits: string[] = ["Extroverted", "Short-haired", "Neutered", "Heart Cond."];

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

                <section className='petRow' style={{ marginBottom: '5em' }}>
                    <PetVisits />
                    <PetAllergies items={petAllergies} />
                    <PetVaccinations items={petVaccinations}/>
                    <PetTraits items={petTraits}/>
                </section>
            </section>
        </section>
    );
}

export default PetProfile;