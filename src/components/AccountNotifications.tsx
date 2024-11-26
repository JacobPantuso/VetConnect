import React from "react";
import '../styles/Notifications.css';
import { User } from "../utils/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCandyCane } from "@fortawesome/free-solid-svg-icons";

type AccountNotificationsProps = {
  user?: User;
  fetching?: boolean;
};

function AccountNotifications({ user, fetching }: AccountNotificationsProps) {

  if (fetching) {
    return (
      <div className="AccountNotifications">
      <div className="account-notifications-content">
        <h2>Account Notifications</h2>
        <div className="no-notifications">
            <div className="loading-circle"></div>
            <p className="loading" style={{width: '200px', marginTop: '1rem'}}></p>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="AccountNotifications">
      <div className="account-notifications-content">
        <h2>{user?.user_type === 'USER' ? 'Account' : 'Clinic'} Notifications</h2>
        <div className="notifications">
          <div className="notification">
             <div className="notification-icon">
                <FontAwesomeIcon icon={faCandyCane} size="2x"/>
              </div>
              <div className="notification-content">
                <h3>Holiday Closure</h3>
                <p>VetConnect will be closed December 25th for the observance of Christmas Day.</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountNotifications;