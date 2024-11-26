import React from "react";
import '../styles/MyPets.css';
import { Link } from 'react-router-dom';
import PetProfileIcon from "./PetProfileIcon";
import { PetProfileProps } from "../MyPets";
import { PetProfile } from "../utils/supabase";

interface PetProfileButtonProps {
  petProfile: PetProfile,
}

function PetProfileButton({petProfile}: PetProfileButtonProps) {

  return (
    <div className="petProfileButton">
      <Link to="/PetProfile" className="petProfileButton">
      <PetProfileIcon petProfile={petProfile}/> 
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