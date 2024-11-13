import React from "react";
import '../styles/Notifications.css';

function AccountNotifications() {
  return (
    <div className="AccountNotifications">
      <div className="account-notifications-content">
        <h2>Account Notifications</h2>
        <div className="no-notifications">
            <img src="/no-notifications.png" alt="No notifications" />
            <p>No updates at the moment!</p>
        </div>
      </div>
    </div>
  );
}

export default AccountNotifications;