import React from "react";

function Gateway() {
  return (
    <div className="Auth">
        <div className="auth-container">
            <div className="auth-box">
                <img className="logo" src="/paw.png" alt="VetConnect Logo" />
                <h2>Verifying Your Identity...</h2>
                <p>This will only take a few seconds.</p>
                <div className="auth-fetching">
                    <span className="loader"></span>
                    <h3>Authenticating...</h3>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Gateway;