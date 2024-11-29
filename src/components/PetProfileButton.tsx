import React from "react";
import '../styles/MyPets.css';
import { Link, useNavigate } from 'react-router-dom';
import PetProfileIcon from "./PetProfileIcon";
import { PetProfile } from "../utils/supabase";

function CrossIconSvg() {
  return (
    <svg width="33" height="33" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.5 1.5L1.5 18.5M1.5 1.5L18.5 18.5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditIconSvg() {
  return (
    <svg width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 32H33.75M25.875 3.12503C26.5712 2.42884 27.5154 2.03772 28.5 2.03772C28.9875 2.03772 29.4702 2.13374 29.9206 2.3203C30.371 2.50686 30.7803 2.78031 31.125 3.12503C31.4697 3.46975 31.7432 3.87899 31.9297 4.32939C32.1163 4.77979 32.2123 5.26252 32.2123 5.75003C32.2123 6.23754 32.1163 6.72027 31.9297 7.17067C31.7432 7.62107 31.4697 8.03031 31.125 8.37503L9.25 30.25L2.25 32L4 25L25.875 3.12503Z" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface PetProfileButtonProps {
  petProfile: PetProfile;
  isEditing: boolean;
}

function PetProfileButton({ petProfile, isEditing }: PetProfileButtonProps) {
  const petId = String(petProfile.id);
  const url = "/petprofile/".concat(petId);
  const navigate = useNavigate();

  return (
    <div className="petProfileButton">
      {isEditing && 
      <div className="hoverPetIcon">
      <div className="petManageOverlay">
        <div onClick={() => { navigate(url) }}>
        <EditIconSvg />
        </div>
        <div onClick={() => { navigate(url) }}>
        <CrossIconSvg />
        </div>
      </div>
    </div>
      }
      <Link to={url} className="petProfileButton">
        <PetProfileIcon petProfile={petProfile} />
        <div className="petProfileInfo">
          <h2 className="myPetsTitle">
            {petProfile.name}
          </h2>
          <h2>
          </h2>
        </div>
      </Link>
    </div>
  );
}

export default PetProfileButton;