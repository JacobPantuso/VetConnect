import React from "react";
import '../styles/MyPets.css';
import { Link } from 'react-router-dom';

function PetProfileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xmlSpace="preserve">
      <g>
        <path fill="white" d="M49.96,44.16L49.96,44.16h-0.01h-0.01l0,0C39.05,44.17,33.86,54.6,29.1,60.68c-5.29,6.75-9.4,13.11-9.1,17.41   c0.69,9.811,9.28,11.71,14.4,10.439c5.1-1.25,11.65-2.34,15.55-2.34c3.92,0,10.45,1.09,15.55,2.34   C70.609,89.79,79.21,87.9,79.91,78.09c0.3-4.3-3.82-10.65-9.1-17.41C66.05,54.6,60.87,44.17,49.96,44.16z" />
        <path fill="white" d="M25.94,56.59c4.58-2.93,4.96-10.52,0.84-16.94c-4.11-6.42-11.16-9.25-15.74-6.31s-4.96,10.52-0.85,16.94   C14.31,56.7,21.36,59.529,25.94,56.59z" />
        <path fill="white" d="M40.55,38.63c5.48-1.52,8.19-9.03,6.05-16.77c-2.15-7.75-8.34-12.79-13.82-11.27c-5.49,1.51-8.2,9.03-6.05,16.77   C28.87,35.11,35.06,40.15,40.55,38.63z" />
        <path fill="white" d="M88.891,33.34c-4.58-2.94-11.631-0.11-15.74,6.31c-4.121,6.43-3.74,14.01,0.85,16.94c4.57,2.939,11.63,0.11,15.74-6.31   C93.85,43.86,93.471,36.28,88.891,33.34z" />
        <path fill="white" d="M59.38,38.63c5.479,1.52,11.67-3.52,13.82-11.27c2.149-7.74-0.56-15.26-6.05-16.77c-5.48-1.52-11.67,3.52-13.811,11.27   C51.18,29.6,53.891,37.11,59.38,38.63z" />
      </g>
    </svg>);
}


function PetProfileButton(petProfile: { petProfileId: number; petProfileName: string; petProfileOwner: string }) {
  //petProfile: {name: String; }
  const petProfileColorId: number = (petProfile.petProfileId % 4)-1;
  const petProfileColors:string[] = ["rgb(255, 40, 115)", "rgb(124, 255, 54)", "rgb(40, 155, 255)"] //Generated colors for pfps
  const petColorIndex = petProfileColors[petProfileColorId];

  return (
    <div className="petProfileButton">
      <Link to="/PetProfile">
      <div className="iconBody" style={{ backgroundColor: petColorIndex }}>
        <div className="icon"><PetProfileIcon /></div>
      </div>
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