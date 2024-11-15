import React from "react";
import '../styles/Notifications.css';
import { User } from "../utils/supabase";

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
        <h2>{user?.user_type !== '' ? 'Clinic' : 'Account'} Notifications</h2>
        <div className="no-notifications">
            <img src="/no-notifications.png" alt="No notifications" />
            <p>No updates at the moment!</p>
        </div>
      </div>
    </div>
  );
}

export default AccountNotifications;