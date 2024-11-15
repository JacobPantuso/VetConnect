import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useUserSession, setupProfile } from "./utils/supabase";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AccountSetup() {
    const {user, fetching} = useUserSession();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [showError, setShowError] = useState(false);
    const [submitText, setSubmitText] = useState('Submit');
    const navigate = useNavigate();
    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    }
    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    }

    const verifyEntries = () => {
        setSubmitText('Submitting...');
        if (!firstName) {
            setFirstNameError(true);
            setSubmitText('Submit');
        } else {
            setFirstNameError(false);
        }
        if (!lastName) {
            setLastNameError(true);
            setSubmitText('Submit');
            return;
        } else {
            setLastNameError(false);
        }
        try {
            setupProfile(firstName, lastName, user?.id || '');
            window.location.reload();
        } catch (error) {
            setShowError(true);
        }
    }

    if (fetching) {
        return (
            <div className="Auth">
                <div className="auth-container">
                    <div className="auth-box">
                        <img className="logo" src="./paw.png" alt="VetConnect Logo" />
                        <h2>Complete Your Profile</h2>
                        <p>We'll use this information to provide a more intentional experience.</p>
                        <div className="auth-fetching">
                            <span className="loader"></span>
                            <h3>Fetching your profile...</h3>
                        </div>
                    </div>
                    <footer>
                        &copy; 2024 VetConnect - All Rights Reserved
                    </footer>
                </div>
            </div>
        )
    }

    return (
        <div className="Auth">
            <div className="auth-container">
                <div className="auth-box">
                    <img className="logo" src="./paw.png" alt="VetConnect Logo" />
                    <h2>Complete Your Profile</h2>
                    <p>We'll use this information to provide a more intentional experience.</p>
                    <div className="wrapper">
                        <form className="account-setup">
                            <label htmlFor="first_name">First Name</label>
                            <input className={firstNameError ? 'error' : ''} type="text" id="first_name" name="first_name" placeholder="John" onChange={handleFirstNameChange}/>
                            <label htmlFor="last_name">Last Name</label>
                            <input className={lastNameError ? 'error' : ''} type="text" id="last_name" name="last_name" placeholder="Doe" onChange={handleLastNameChange}/>
                        </form>
                        <button className="setup-submit" onClick={verifyEntries}>{submitText}</button>
                    </div>
                </div>
                {showError && (
                <div className="error-box">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <div className="error-message">
                        <h3>Error Occurred</h3>
                        <p>It looks like there was an issue reaching our services. Please try again later...</p>
                    </div>
                </div>
                )}

            </div>
        </div>
    )
}

export default AccountSetup;