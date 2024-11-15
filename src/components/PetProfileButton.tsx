import React from "react";
import '../styles/MyPets.css';
import { Link } from 'react-router-dom';
import PetProfileIcon from "./PetProfileIcon";
import { PetProfileProps } from "../MyPets";

interface PetProfileButtonProps {
  petProfile: PetProfileProps,
}

function PetProfileButton({petProfile}: PetProfileButtonProps) {

  return (
    <div className="petProfileButton">
      <Link to="/PetProfile">
      <PetProfileIcon petProfile={petProfile}/> 
      <div className="petProfileInfo">
        <h2 className="title">
          {petProfile.petProfileName}
        </h2>
        <h2>
        </h2>
      </div>
      </Link>
    </div>
  );
}

export default PetProfileButton;