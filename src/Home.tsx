import React from 'react';
import { useUserSession } from './utils/supabase';
import './styles/Home.css';
import AppointmentSummary from './components/AppointmentSummary';
import BillingSummary from './components/BillingSummary';
import AccountNotifications from './components/AccountNotifications';

function Home() {
  const { user, fetching } = useUserSession();

  if (fetching) {
    return (
      <div className="Home">
          <div className='home-content'>
            <p className='loading' style={{width:'250px', height: '30px'}}></p>
            <p className='loading' style={{width:'320px', height: '20px'}}></p>
          </div>
      </div>
    );
  }

  return (
    <div className="Home">
        <div className='home-content'>
          <div className='content-left'>
            <h2 className='welcome'>Welcome, {user?.first_name}!</h2>
            <p>No pets have any upcoming appointments.</p>
            {user && <BillingSummary user={user} />}
            {user && <AppointmentSummary user={user} />}
          </div>
          <div className='content-right'>
            <AccountNotifications />
          </div>
        </div>
    </div>
  );
}

export default Home;