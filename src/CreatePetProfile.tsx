import React, { useState } from 'react';
import { useUserSession } from './utils/supabase';
import './styles/CreatePetProfile.css';
import { Link } from 'react-router-dom';

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
        <svg width="100%" height="100%" viewBox="0 0 1139 676" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke="#3c3e3c" d="M1138.5 52V670C1138.5 673.038 1136.04 675.5 1133 675.5H6.00002C2.96245 675.5 0.5 673.038 0.5 670V58C0.5 54.9624 2.96243 52.5 6 52.5H341.606H486.467C488.316 52.5 490.078 51.7122 491.311 50.3338L534.252 2.33297C535.296 1.16663 536.786 0.5 538.351 0.5H858.009H998.035H1021.53H1133C1136.04 0.5 1138.5 2.96243 1138.5 6V52Z" />
        </svg>
    );
}

function CreatePetProfile() {
    const { user, fetching } = useUserSession();

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
                    </div>
                </div>
            </section>
        </section>
    );
}

export default CreatePetProfile;