import React from "react";
import { User } from "../utils/supabase";
import "../styles/Profile.css";

type UserProfileProps = {
    user?: User;
    fetching?: boolean;
};

function UserProfile({user, fetching} : UserProfileProps) {
    if (fetching) {
        return (
            <div className="UserProfile">
                <h3>Loading...</h3>
            </div>
        );
    }

    return (
        <div className="UserProfile">
            <div className="profile-container">
                <div className="profile-pic profile">
                    <p>{user?.first_name?.charAt(0).toUpperCase()}</p>
                    <p>{user?.last_name?.charAt(0).toUpperCase()}</p>
                </div>
                <div className="profile-info profile">
                    <h2>{user?.first_name} {user?.last_name}</h2>
                    <p>{user?.email}</p>
                </div>
                <button className="logout">Signout</button>
            </div>
        </div>
    );
}

export default UserProfile;