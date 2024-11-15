import React, { useState } from 'react';
import { useUserSession } from './utils/supabase';
import './styles/MyPets.css';
import PetProfileButton from './components/PetProfileButton';

interface ManageProfileProps {
  isEditing: boolean,
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PetProfileProps {
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

function ManageProfiles({ isEditing, setIsEditing }: ManageProfileProps) {
  if (isEditing) {
    return (
      <button onClick={() => setIsEditing(false)} className='done'>Done</button>
    );
  } else {
    return (
      <button onClick={() => setIsEditing(true)} className='manageButton'>Manage Profiles</button>
    );
  }

}

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
      <div className='title'>
        <h1>
          My Pets
        </h1>
      </div>

      <div className="petList">
        <div className='petRow'>
          <PetProfileButton {...petProfile} />
          <PetProfileButton {...petProfile} />
          <PetProfileButton {...petProfile} />
        </div>
      </div>

      <div className='manageProfiles'>
        <ManageProfiles isEditing={isEditing} setIsEditing={setIsEditing}/>
      </div>

    </section>
  );
}

export default MyPets;