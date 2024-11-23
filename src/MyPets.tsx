import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  petProfileName: "Buddy",
  petProfileOwner: "Noah"
};

const petProfile3: PetProfileProps = {
  petProfileId: 3,
  petProfileName: "Max",
  petProfileOwner: "Noah"
};

function AddIconSvg() {
  return (
    <svg width="95" height="95" viewBox="0 0 95 95" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M42.7915 71.0417H52.2082V52.2084H71.0415V42.7917H52.2082V23.9583H42.7915V42.7917H23.9582V52.2084H42.7915V71.0417ZM47.4998 94.5833C40.9866 94.5833 34.8658 93.367 29.1373 90.9344C23.4089 88.4233 18.4259 85.049 14.1884 80.8115C9.95088 76.574 6.57657 71.591 4.06546 65.8625C1.63282 60.134 0.416504 54.0132 0.416504 47.5C0.416504 40.9868 1.63282 34.866 4.06546 29.1375C6.57657 23.409 9.95088 18.4261 14.1884 14.1886C18.4259 9.95106 23.4089 6.61599 29.1373 4.18335C34.8658 1.67224 40.9866 0.416687 47.4998 0.416687C54.013 0.416687 60.1339 1.67224 65.8623 4.18335C71.5908 6.61599 76.5738 9.95106 80.8113 14.1886C85.0488 18.4261 88.3839 23.409 90.8165 29.1375C93.3276 34.866 94.5832 40.9868 94.5832 47.5C94.5832 54.0132 93.3276 60.134 90.8165 65.8625C88.3839 71.591 85.0488 76.574 80.8113 80.8115C76.5738 85.049 71.5908 88.4233 65.8623 90.9344C60.1339 93.367 54.013 94.5833 47.4998 94.5833ZM47.4998 85.1667C58.0151 85.1667 66.9217 81.5177 74.2196 74.2198C81.5176 66.9219 85.1665 58.0153 85.1665 47.5C85.1665 36.9847 81.5176 28.0781 74.2196 20.7802C66.9217 13.4823 58.0151 9.83335 47.4998 9.83335C36.9846 9.83335 28.078 13.4823 20.78 20.7802C13.4821 28.0781 9.83317 36.9847 9.83317 47.5C9.83317 58.0153 13.4821 66.9219 20.78 74.2198C28.078 81.5177 36.9846 85.1667 47.4998 85.1667Z" />
    </svg>
  );
}

function AddIconButton() {
  let navigate = useNavigate();

  return (
    <div className='addIconButton' onClick={() => { navigate("/createpetprofile") }}>
      <AddIconSvg />
    </div>
  )
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
            {isEditing && <AddIconButton />}
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