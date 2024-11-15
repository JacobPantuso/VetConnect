import React, { useState } from 'react';
import { useUserSession } from './utils/supabase';
import './styles/MyPets.css';
import PetProfileButton from './components/PetProfileButton';
import EditButton from './components/EditButton';

export interface PetProfileProps {
  petProfileId: number,
  petProfileName: string,
  petProfileOwner: string,
}

//Default value
const petProfile: PetProfileProps = {
  petProfileId: 1,
  petProfileName: "Sparky",
  petProfileOwner: "Noah"
};

const petProfile2: PetProfileProps = {
  petProfileId: 2,
  petProfileName: "Sparky",
  petProfileOwner: "Noah"
};

const petProfile3: PetProfileProps = {
  petProfileId: 3,
  petProfileName: "Sparky",
  petProfileOwner: "Noah"
};

function MyPets() {
  const { user, fetching } = useUserSession();
  const [isEditing, setIsEditing] = useState(false);

  if (fetching) {
    return (
      <div>

      </div>
    );
  }

  return (
    <section className='MyPets'>
      <div className="myPetsTitle">
        <h1>
          My Pets
        </h1>
      </div>


      <div className='petContainer'>
        <div className="petList">
          <div className='petRow'>
            <PetProfileButton petProfile={petProfile} />
            <PetProfileButton petProfile={petProfile2} />
            <PetProfileButton petProfile={petProfile3} />
          </div>
        </div>
      </div>


      <div className='manageProfiles'>
        <EditButton isEditing={isEditing} setIsEditing={setIsEditing} value={"Manage Profiles"} />
      </div>
    </section>
  );
}

export default MyPets;