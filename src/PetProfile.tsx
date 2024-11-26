import React, { useState } from 'react';
import { useUserSession } from './utils/supabase';
import './styles/PetProfile.css';
import PetProfileIcon from './components/PetProfileIcon';
import { PetProfileProps } from './MyPets';
import EditButton from './components/EditButton';
import { Link } from 'react-router-dom';
import { traits, allergies, vaccinations, InfoBubbleValues } from './components/InfoBubbles';
import SearchTags from './components/SearchTags';

//Default value
const petProfile: PetProfileProps = {
    petProfileId: 1,
    petProfileName: "Sparky",
    petProfileOwner: "Noah"
};

function CrossIconSvg() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.5 1.5L1.5 18.5M1.5 1.5L18.5 18.5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function AddIconSvg() {
    return (
        <svg className='editIcons' width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6666 20.6666H15.3333V15.3333H20.6666V12.6666H15.3333V7.33329H12.6666V12.6666H7.33329V15.3333H12.6666V20.6666ZM14 27.3333C12.1555 27.3333 10.4222 26.9888 8.79996 26.3C7.17774 25.5888 5.76663 24.6333 4.56663 23.4333C3.36663 22.2333 2.41107 20.8222 1.69996 19.2C1.01107 17.5777 0.666626 15.8444 0.666626 14C0.666626 12.1555 1.01107 10.4222 1.69996 8.79996C2.41107 7.17774 3.36663 5.76662 4.56663 4.56663C5.76663 3.36662 7.17774 2.42218 8.79996 1.73329C10.4222 1.02218 12.1555 0.666626 14 0.666626C15.8444 0.666626 17.5777 1.02218 19.2 1.73329C20.8222 2.42218 22.2333 3.36662 23.4333 4.56663C24.6333 5.76662 25.5777 7.17774 26.2666 8.79996C26.9777 10.4222 27.3333 12.1555 27.3333 14C27.3333 15.8444 26.9777 17.5777 26.2666 19.2C25.5777 20.8222 24.6333 22.2333 23.4333 23.4333C22.2333 24.6333 20.8222 25.5888 19.2 26.3C17.5777 26.9888 15.8444 27.3333 14 27.3333ZM14 24.6666C16.9777 24.6666 19.5 23.6333 21.5666 21.5666C23.6333 19.5 24.6666 16.9777 24.6666 14C24.6666 11.0222 23.6333 8.49996 21.5666 6.43329C19.5 4.36663 16.9777 3.33329 14 3.33329C11.0222 3.33329 8.49996 4.36663 6.43329 6.43329C4.36663 8.49996 3.33329 11.0222 3.33329 14C3.33329 16.9777 4.36663 19.5 6.43329 21.5666C8.49996 23.6333 11.0222 24.6666 14 24.6666Z" />
        </svg>

    );
}

function TrashIconSvg() {
    return (
        <svg width="28" height="30" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke="#595959" d="M2 6.99996H4.66667M4.66667 6.99996H26M4.66667 6.99996L4.66667 25.6666C4.66667 26.3739 4.94762 27.0521 5.44772 27.5522C5.94781 28.0523 6.62609 28.3333 7.33333 28.3333H20.6667C21.3739 28.3333 22.0522 28.0523 22.5523 27.5522C23.0524 27.0521 23.3333 26.3739 23.3333 25.6666V6.99996M8.66667 6.99996V4.33329C8.66667 3.62605 8.94762 2.94777 9.44772 2.44767C9.94781 1.94758 10.6261 1.66663 11.3333 1.66663H16.6667C17.3739 1.66663 18.0522 1.94758 18.5523 2.44767C19.0524 2.94777 19.3333 3.62605 19.3333 4.33329V6.99996M11.3333 13.6666V21.6666M16.6667 13.6666V21.6666" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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

function ClockSvg() {
    const fillColor: string = "#D5DDDF";

    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke={fillColor} d="M10.0001 4.99996V9.99996L13.3334 11.6666M18.3334 9.99996C18.3334 14.6023 14.6025 18.3333 10.0001 18.3333C5.39771 18.3333 1.66675 14.6023 1.66675 9.99996C1.66675 5.39759 5.39771 1.66663 10.0001 1.66663C14.6025 1.66663 18.3334 5.39759 18.3334 9.99996Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CompletedIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke="#D5DDDF" d="M18.3334 9.2333V9.99997C18.3323 11.797 17.7504 13.5455 16.6745 14.9848C15.5985 16.4241 14.0861 17.477 12.3628 17.9866C10.6395 18.4961 8.79774 18.4349 7.11208 17.8121C5.42642 17.1894 3.98723 16.0384 3.00915 14.5309C2.03108 13.0233 1.56651 11.24 1.68475 9.4469C1.80299 7.65377 2.49769 5.94691 3.66525 4.58086C4.83281 3.21482 6.41068 2.26279 8.16351 1.86676C9.91635 1.47073 11.7502 1.65192 13.3917 2.3833M18.3334 3.3333L10 11.675L7.50002 9.17497" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

//<PetProfileIcon petProfile={petProfile} size='6em' />

function PetTitle() {
    return (
        <div className='petTitle'>
            <div>
                
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

interface AppointmentItemProps {
    appointment_id: number,
    doctorName: string,
    date: Date,
    status: string
}

interface Appointment {
    appointment_id: number,
    scheduled_date: Date,
    pet_profile_id: number,
    vet_name: string,
    appointment_status: string,
    service: string,
}


function AppointmentItem(appointment: AppointmentItemProps) {
    let formatDate = appointment.date.toLocaleString('en-us', { year: "numeric", month: "long", day: "numeric" });

    return (
        <div className='appointmentItem'>
            <h3><span className='doctorName'>{appointment.doctorName}</span></h3>

            {appointment.status === 'Completed' ?
                <div className='appointmentDate appointmentCompleted'>
                    <CompletedIcon />
                    <h3>Completed {formatDate}</h3>
                </div>
                :
                appointment.status === "Scheduled" ?
                    <div className='appointmentDate'>
                        <ClockSvg />
                        <h3>On {formatDate}</h3>
                    </div>
                    :
                    <div className='appointmentDate'>
                        <CompletedIcon />
                        <h3>Cancelled {formatDate}</h3>
                    </div>
            }



        </div>
    );
}

interface PetVisitsProps {
    appointments: Appointment[]
}

function PetVisits({ appointments }: PetVisitsProps) {
    let sortedAppointments = appointments.sort((a: Appointment, b: Appointment) => {
        return  b.scheduled_date.getTime() - a.scheduled_date.getTime();
    })
    const appointmentList = sortedAppointments.map((item) => {
        return (
            <AppointmentItem key={item.appointment_id} appointment_id={item.appointment_id} date={item.scheduled_date} status={item.appointment_status} doctorName={item.vet_name} />
        );
    })

    return (
        <div className='petVisits'>
            <h2>Visits</h2>
            <div className='petProfileContainer'>
                {appointmentList}
            </div>
        </div>

    );
}

export interface InfoBubbleProps {
    value: string,
    color?: string,
    isEditing: boolean
    removeBubble: Function,
};

function InfoBubble({ value, color, isEditing, removeBubble }: InfoBubbleProps) {
    return (
        <div className='infoBubbleContainer'>
            <div className='infoBubble'>
                <h2 className='infoBubbleHeading'>
                    {value}
                </h2>

                <div className='petProfileCross'>
                    {isEditing &&
                        <div className='crossIconSvg' onClick={() => removeBubble(value)}>
                            <CrossIconSvg />
                        </div>
                    }
                </div>

            </div>

        </div>

    );
}

export interface PetBubbleStats {
    isEditing: boolean,
    buttons: InfoBubbleValues,
    title: string,
    onClickAdd: Function,
    onMouseDown: Function,
    removeBubble: Function,
};

function PetBubbleStat({ isEditing, buttons, title, onClickAdd, onMouseDown, removeBubble }: PetBubbleStats) {
    const listItems = Object.entries(buttons).map(([key, value]) => {
        if (value) {
            return (
                <InfoBubble value={key} isEditing={isEditing} removeBubble={removeBubble} />
            );
        }
    });

    return (
        <div className='petTraits'>
            <h2>{title}</h2>
            <div className='petProfileContainer'>
                {listItems}
            </div>
            {isEditing &&
                <div className='editIcons'>
                    <div className='addButtonSvg' onMouseDown={(e) => { onMouseDown(e); onClickAdd(title) }}>
                        <AddIconSvg />
                    </div>
                </div>
            }
        </div>
    );
}

function PetProfile() {
    const defaultAppointment: Appointment = {
        appointment_id: 1,
        scheduled_date: new Date("2023-05-03"),
        pet_profile_id: 2,
        vet_name: "Dr.M",
        appointment_status: "Completed",
        service: "Idk",
    }
    const defaultAppointment2: Appointment = {
        appointment_id: 2,
        scheduled_date: new Date("2024-02-20"),
        pet_profile_id: 2,
        vet_name: "Dr.Hello",
        appointment_status: "Scheduled",
        service: "Idk",
    }


    const { user, fetching } = useUserSession();
    const [isEditing, setIsEditing] = useState(false);

    const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([defaultAppointment,defaultAppointment2]);

    const [selectedTraits, setSelectedTraits] = useState<InfoBubbleValues>(traits);
    const [selectedVaccinations, setSelectedVaccinations] = useState<InfoBubbleValues>(vaccinations);
    const [selectedAllergies, setSelectedAllergies] = useState<InfoBubbleValues>(allergies);

    //Traits, Vaccinations, Allergies
    const [openedMenu, setOpenedMenu] = useState<string>("None");
    const [mousePosition, setMousePosition] = useState<number[]>([0, 0]);

    const handleSelectTraits = (key: string) => {
        let newTraits = { ...selectedTraits };
        newTraits[key] = !newTraits[key];
        setSelectedTraits(newTraits);
    };

    const handleSelectVaccinations = (key: string) => {
        let newVaccinations = { ...selectedVaccinations };
        newVaccinations[key] = !newVaccinations[key];
        setSelectedVaccinations(newVaccinations);
    };

    const handleSelectAllergies = (key: string) => {
        let newAllergies = { ...selectedAllergies };
        newAllergies[key] = !selectedAllergies[key];
        setSelectedAllergies(newAllergies);
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

    const GetMousePosition = (e: any) => {
        let newMousePosition: [number, number] = [0, 0];
        newMousePosition[0] = e.clientX;
        newMousePosition[1] = e.clientY;
        setMousePosition(newMousePosition);
    };

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
                    <EditButton isEditing={isEditing} onClickDone={handleOpenMenu} setIsEditing={setIsEditing} value='Edit Pet Profile' />
                </div>
            </section>
            <section className='petInfo'>
                <section className='petRow'>
                    <PetTitle />
                    <PetStats />
                </section>

                <section className='petRow' style={{ marginBottom: '5em' }}>
                    <PetVisits appointments={appointmentsList} />
                    <PetBubbleStat title="Allergies" removeBubble={handleSelectAllergies} isEditing={isEditing} buttons={selectedAllergies} onMouseDown={GetMousePosition} onClickAdd={handleOpenMenu} />
                    <PetBubbleStat title="Vaccinations" removeBubble={handleSelectVaccinations} isEditing={isEditing} buttons={selectedVaccinations} onMouseDown={GetMousePosition} onClickAdd={handleOpenMenu} />
                    <PetBubbleStat title="Traits" removeBubble={handleSelectTraits} isEditing={isEditing} buttons={selectedTraits} onMouseDown={GetMousePosition} onClickAdd={handleOpenMenu} />
                </section>

                {openedMenu === "Traits" && <SearchTags mousePosition={mousePosition} buttons={selectedTraits} setSelectedButtons={handleSelectTraits} />}
                {openedMenu === "Vaccinations" && <SearchTags mousePosition={mousePosition} buttons={selectedVaccinations} setSelectedButtons={handleSelectVaccinations} />}
                {openedMenu === "Allergies" && <SearchTags mousePosition={mousePosition} buttons={selectedAllergies} setSelectedButtons={handleSelectAllergies} />}

            </section>
        </section>
    );
}

export default PetProfile;