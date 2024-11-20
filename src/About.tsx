import React from "react";
import './styles/About.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faLocationPin } from "@fortawesome/free-solid-svg-icons";

function About() {
    return (
        <div className="About">
            <div className="about-left">
                <img src="./about-banner.png" alt="about with dogs" />
            </div>
            <div className="about-right">
                <div className="title">
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <h1 className="about-header">About Us</h1>
                </div>
                <p className="about-text">
                    Welcome to VetConnect, where we believe healthy, happy pets lead to 
                    joyful lives. Guided by our values, our mission is to connect pet owners with 
                    our top-tier veterinary care and resources. We’re dedicated to making every visit a 
                    positive experience, ensuring the well-being of your furry friends. Our platform fosters trust, 
                    ompassion, and innovation, providing the tools you need to keep your pets thriving. 
                    Whether it's routine checkups or specialized care, we’re here to support the bond 
                    between you and your pets, making happiness and health our top priority.
                </p>
                <div className="title">
                    <FontAwesomeIcon icon={faLocationPin} />
                    <h1 className="about-header">Location</h1>
                </div>
                <div className="location">
                    <div className="address">
                        <p>Located in the heart of Downtown Toronto, we're ready to care for your furry friends!</p>
                        <p id="start-address">350 King Street West</p>
                        <p>Toronto, ON, Canada</p>
                        <p id="phone"><b>Non-Emergency Line:</b> (905)-323-3333</p>
                        <p><b>Emergency Line:</b> (905)-323-3334</p> 
                    </div>
                    <iframe className="map" title="gmaps" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=350%20King%20Street%20West,%20Toronto%20ON+(VetConnect)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/">gps tracker sport</a></iframe>
                </div>
            </div>
        </div>
    )
}

export default About;