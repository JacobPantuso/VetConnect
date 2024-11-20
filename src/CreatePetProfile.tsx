import React, { useState } from 'react';
import { useUserSession } from './utils/supabase';
import './styles/CreatePetProfile.css';
import { Link } from 'react-router-dom';
import SearchTags from './components/SearchTags';

function ArrowSvg() {
    const fillColor: string = "#D5DDDF";

    return (
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill={fillColor} d="M8.62813 19.625L20.5281 31.525L17.5 34.5L0.5 17.5L17.5 0.5L20.5281 3.475L8.62813 15.375H34.5V19.625H8.62813Z" />
        </svg>
    );
}

function FolderBackground() {
    /*
            <svg width="100%" height="100%" viewBox="0 0 1139 676" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path  d="M1138.5 52V670C1138.5 673.038 1136.04 675.5 1133 675.5H6.00002C2.96245 675.5 0.5 673.038 0.5 670V58C0.5 54.9624 2.96243 52.5 6 52.5H341.606H486.467C488.316 52.5 490.078 51.7122 491.311 50.3338L534.252 2.33297C535.296 1.16663 536.786 0.5 538.351 0.5H858.009H998.035H1021.53H1133C1136.04 0.5 1138.5 2.96243 1138.5 6V52Z" />
            </svg>
    */

    return (
        <svg width="100%" height="100%" viewBox="0 0 1139 715" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1138.5 52V708.5C1138.5 711.538 1136.04 714 1133 714H6.00002C2.96245 714 0.5 711.538 0.5 708.5V58C0.5 54.9624 2.96244 52.5 6 52.5H341.606H486.467C488.316 52.5 490.078 51.7122 491.311 50.3338L534.252 2.33297C535.296 1.16663 536.786 0.5 538.351 0.5H858.009H998.035H1021.53H1133C1136.04 0.5 1138.5 2.96243 1138.5 6V52Z" fill="none" stroke="#3c3e3c" />
        </svg>
    );
}

function CrossSvg() {
    return (
        <svg className='crossSvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.5 1.5L1.5 18.5M1.5 1.5L18.5 18.5" className='crossSvg' stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
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
};

function TraitInfoBubble({ value, color }: InfoBubbleProps) {
    return (
        <div className='petCreationInfoBubble'>
            <div className='petCreationInfoBubbleTitle'>
                <h2>{value}</h2>
            </div>
            <div className='petCreationInfoBubbleCross'>
                <CrossSvg />
            </div>
        </div>
    );
}


function InfoBubble({ value, color }: InfoBubbleProps) {
    return (
        <div className='petCreationInfoBubbleVA'>
            <div className='petCreationInfoBubbleTitleVA'>
                <h2>{value}</h2>
            </div>
            <div className='petCreationInfoBubbleCrossVA'>
                <CrossSvg />
            </div>
        </div>
    );
}

function AddBubble({ value, color }: InfoBubbleProps) {
    return (
        <div className='petCreationAddBubble'>
            <div className='petCreationAddBubbleIcon'>
                <AddSvg />
            </div>
            <div className='petCreationAddBubbleTitle'>
                <h2>{value}</h2>
            </div>

        </div>
    )
}

function CreatePetProfile() {
    const { user, fetching } = useUserSession();
    const [selectedTraits, setSelectedTraits] = useState<boolean[]>([true, false, false, true]); 
    const traits: string[] = ["Cat",'Dog','Horse','Pig'];

    const handleSelect = (index: number) => {
        let newTraits = [...selectedTraits];
        newTraits[index] = !newTraits[index];
        setSelectedTraits(newTraits);
      };


    if (fetching) {
        return (
            <div>

            </div>
        );
    }

    return (
        <section className='createPetProfile'>
            <section className='title'>
                <div className='backSection'>
                    <Link to={"/mypets"}>
                        <ArrowSvg />
                    </Link>
                    <h1>Create a Pet Profile</h1>
                </div>
            </section>
            <section className='fillInSection'>
                <FolderBackground />
                <div className='petCreationContainer'>
                    <div className='petCreationColumn1'>

                        <div className='petName'>
                            <h2>Name:</h2>
                            <input type="text"></input>
                        </div>

                        <div className='petSpecies'>
                            <h2>Species:</h2>
                            <input type="text"></input>
                        </div>

                        <div className='petDOB'>
                            <h2>Date Of Birth:</h2>
                            <input type="date"></input>
                        </div>

                        <div className='petCreationTraits'>
                            <h2>Traits:</h2>
                            <div className='petCreationTraitsSection'>
                                <div className='petCreationTraitsRow'>
                                    <TraitInfoBubble value='Introverted' />
                                    <TraitInfoBubble value='Heart Cond.' />
                                </div>
                                <div className='petCreationTraitsRow'>
                                    <TraitInfoBubble value='Diabetes' />
                                    <TraitInfoBubble value='Short-hair' />
                                </div>
                                <div className='petCreationTraitsRow'>
                                    <TraitInfoBubble value='Blindness' />
                                    <TraitInfoBubble value='Deaf' />
                                </div>
                                <div className='petCreationTraitsRow'>
                                    <AddBubble value="Add Trait" />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='petCreationColumn2'>
                        <div className='petCreationRow'>

                            <div className='petGender'>
                                <h2>Gender:</h2>
                                <select className='petGender'>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div className='petWeight'>
                                <h2>Weight:</h2>
                                <div className='weightSuffix'>
                                    <input type="number" ></input>
                                </div>
                            </div>

                            <div className='petHeight'>
                                <h2>Height:</h2>
                                <div className='heightSuffix'>
                                    <input type="number" ></input>
                                </div>
                            </div>
                        </div>

                        <div className='petCreationRow2'>
                            <div className='petCreationVaccinations'>
                                <h2>Vaccinations:</h2>
                                <div className='petCreationVaccinationContainer'>
                                    <InfoBubble value='D12'/>
                                    <InfoBubble value='L2H-3LD'/>
                                    <AddBubble value='Add Vaccination'/>
                                </div>
                            </div>
                            <div className='petCreationAllergies'>
                                <h2>Allergies:</h2>
                                <div className='petCreationVaccinationContainer'>
                                    <InfoBubble value='Dust'/>
                                    <InfoBubble value='Smoke'/>
                                    <InfoBubble value='Grass'/>
                                    <AddBubble value='Add Allergy'/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <SearchTags buttons={traits} selectedButtons={selectedTraits} setSelectedButtons={handleSelect}/>
            <div>Save Button</div>
        </section>
    );
}

export default CreatePetProfile;