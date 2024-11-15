import React, { useState } from 'react';
import { useUserSession } from './utils/supabase';
import './styles/PetProfile.css';

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
                <h1>My Pets</h1>
            </section>
            <section className='petInfo'>
                <section className='petRow'>
                    <div className='petTitle'>
                        Pet Title
                    </div>
                    <div className='petStats'>
                        Pet Stats
                    </div>
                </section>

                <section className='petRow'>
                    <div className='petAllergies'>
                        Pet Allergies
                    </div>
                    <div className='petVaccinations'>
                        Pet Vaccs
                    </div>

                    <div className='petTraits'>
                        Pet Traits
                    </div>

                    <div className='petVisits'>
                        PetVisits
                    </div>
                </section>
            </section>
        </section>
    );
}

export default PetProfile;