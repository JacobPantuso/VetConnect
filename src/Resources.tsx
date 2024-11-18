import React, { useState, useEffect, useRef } from "react";
import './styles/Resources.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBone, faShieldAlt, faPaw, faHeartbeat,
    faFirstAid, faHouseUser, faSnowflake, faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

type ResourceSection = {
    title: string;
    description: string;
    icon: any;
    items: string[];
};

const resourcesData: ResourceSection[] = [
    {
        title: "Nutrition & Diet",
        description: "Information on balanced diets, pet food brands, and special dietary needs for your pets.",
        icon: faBone,
        items: [
            "Balanced diets for different pets",
            "Managing pet allergies or special dietary needs",
            "Pet food brands and ingredient guidelines",
        ],
    },
    {
        title: "Preventative Care",
        description: "Guides on regular check-ups, vaccinations, and preventive measures to keep your pet healthy.",
        icon: faShieldAlt,
        items: [
            "Regular check-ups and vaccinations",
            "Flea, tick, and heartworm prevention tips",
            "Dental hygiene for pets",
        ],
    },
    {
        title: "Behavior & Training",
        description: "Tips for training, addressing behavior issues, and socializing your pets effectively.",
        icon: faPaw,
        items: [
            "Basic training guides for puppies and kittens",
            "Addressing common behavior issues",
            "Socialization tips for new pets",
        ],
    },
    {
        title: "Health & Wellness",
        description: "Resources to recognize signs of illness, senior pet care, and mental stimulation activities.",
        icon: faHeartbeat,
        items: [
            "Recognizing signs of illness",
            "Senior pet care and age-related issues",
            "Mental stimulation and exercise tips",
        ],
    },
    {
        title: "Emergency Care",
        description: "Essential first aid information and emergency contacts for 24-hour vet clinics.",
        icon: faFirstAid,
        items: [
            "First aid basics for pet owners",
            "Handling common emergencies",
            "24-hour emergency vet clinic contacts",
        ],
    },
    {
        title: "Pet Ownership Essentials",
        description: "Guidance for new pet owners, home preparation, and travel tips with pets.",
        icon: faHouseUser,
        items: [
            "New pet checklists",
            "Preparing your home for a new pet",
            "Travel and moving tips with pets",
        ],
    },
    {
        title: "Seasonal Pet Care",
        description: "Advice on keeping pets safe during extreme weather and holiday seasons.",
        icon: faSnowflake,
        items: [
            "Pet safety during extreme weather",
            "Holiday-specific pet care tips",
        ],
    },
];


function Resources() {
    const [openSectionIndex, setOpenSectionIndex] = useState<number | null>(null);
    const contentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});


    const toggleSection = (index: number) => {
        setOpenSectionIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    useEffect(() => {
        Object.keys(contentRefs.current).forEach((key) => {
            const idx = parseInt(key);
            const content = contentRefs.current[idx];
            if (content) {
                if (openSectionIndex === idx) {
                    content.style.height = `${content.scrollHeight}px`;
                } else {
                    content.style.height = '0px';
                }
            }
        });
    }, [openSectionIndex]);


    return (
        <div className="Resources">
            <div className="resources-left">
                <h1 className="resources-header">Resources</h1>
                <div className="resources-container">
                    <p className="resources-intro">
                        This page offers reliable information to support your pet’s health and well-being.
                        From nutrition to preventative care, we've got you covered!
                    </p>
                    {resourcesData.map((section, index) => (
                        <div key={index} className="section-container">
                            <div
                                className="section-header"
                                onClick={() => toggleSection(index)}
                            >
                                <div className="section-title">
                                    <FontAwesomeIcon
                                        icon={section.icon}
                                        className="section-icon"
                                    />
                                    <div>
                                        <h2 style={{ margin: 0 }}>{section.title}</h2>
                                        <p className="section-description">{section.description}</p>
                                    </div>
                                </div>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className="chevron-icon"
                                    style={{
                                        transform: openSectionIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                    }}
                                />
                            </div>
                            <div
                                ref={(el) => (contentRefs.current[index] = el)}
                                className={`section-content ${openSectionIndex === index ? 'open' : ''}`}
                            >
                                <ul className="item-list">
                                    {section.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="resources-right">
                <h1>Require Assistance?</h1>
                <p>We know owning a pet can sometimes be stressful. If you have any questions that are not answered on this page, please visit our <Link to={'/about'}>about</Link> section for more information.</p>
            </div>
        </div>
    );
};

export default Resources;