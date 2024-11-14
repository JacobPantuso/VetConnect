import React from 'react';
import { useUserSession } from './utils/supabase';
import './styles/MyPets.css';
import PetProfileButton from './components/PetProfileButton';

const petProfile = {
  petProfileId: 1,
  petProfileName: "Sparky",
  petProfileOwner: "Noah"
};

function ManageProfiles() {
  return (
      <button className='manageButton'>Manage Profiles</button>
  );
}

function MyPets() {

  const { user, fetching } = useUserSession();

  if (fetching) {
    return (
      <div className="Home">
        <div className='home-content'>
          <p className='loading' style={{ width: '250px', height: '30px' }}></p>
          <p className='loading' style={{ width: '320px', height: '20px' }}></p>
        </div>
      </div>
    );
  }

  return (
    <section className='MyPets'>
      <div className='title'>
        <h1>
          My Pets
        </h1>
      </div>

      <div className="petList">
        <div className='petRow'>
          <PetProfileButton {...petProfile}/>
        </div>
      </div>

      <div className='manageProfiles'>
        <ManageProfiles/>
      </div>

    </section>
  );
}

export default MyPets;