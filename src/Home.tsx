import React, {useState, useEffect} from 'react';
import { useUserSession, User } from './utils/supabase';
import './styles/Home.css';
import AppointmentSummary from './components/AppointmentSummary';
import BillingSummary from './components/BillingSummary';
import AccountNotifications from './components/AccountNotifications';

function HoursUntilFivePM(): string {
  return (
      new Date().getHours() >= 17
        ? "closed for the day."
        : `open for another ${Math.floor(
            (new Date(new Date().setHours(17, 0, 0, 0)).getTime() - new Date().getTime()) / (1000 * 60 * 60)
          )} hours and ${Math.floor(
            ((new Date(new Date().setHours(17, 0, 0, 0)).getTime() - new Date().getTime()) % (1000 * 60 * 60)) / (1000 * 60)
          )} minutes.`
  );
};

function Home() {
  const { user, fetching } = useUserSession();
  if (fetching) {
    return (
      <div className="Home">
          <div className='home-content'>
            <div className='content-left'>
              <p className='loading' style={{width:'250px', height: '30px'}}></p>
              <p className='loading' style={{width:'320px', height: '20px'}}></p>
              <BillingSummary fetching={true}/>
              <AppointmentSummary fetching={true}/>
            </div>
            <div className='content-right'>
              <AccountNotifications fetching={true} />
            </div>
          </div>
      </div>
    );
  }
  if (user?.user_type === 'CS') {
    return (
      <ClinicStaff user={user} />
    )
  }

  if (user?.user_type === 'VET') {
    return (
      <Vet user={user} />
    );
  }

  return (
    <div className="Home">
        <div className='home-content'>
          <div className='content-left'>
            <h2 className='welcome'>Welcome, {user?.first_name}!</h2>
            {user && user.appointments.filter(
                (appointment) => appointment.appointment_status === "scheduled"
              ).length > 0
                ? <p>{
                    user.petProfiles.filter(
                      (profile) => profile.id === user.appointments[0].pet_profile_id
                    )[0].name
                  } has an upcoming appointment on {new Date(
                    user.appointments[0].scheduled_date.split(" ")[0]
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</p>
                : <p>"No pets have upcoming appointments"</p>}
            {user && <BillingSummary user={user} />}
            {user && <AppointmentSummary user={user} />}
          </div>
          <div className='content-right'>
            {user && <AccountNotifications user={user} />}
          </div>
        </div>
    </div>
  );
}

interface ExternalProps {
  user: User;
}

function Vet({ user }: ExternalProps) {
  return (
    <div className="Home">
    <div className='home-content'>
      <div className='content-left'>
        <h2 className='welcome'>Welcome, {user?.first_name}. {user?.last_name}!</h2>
        <p>Your next appointment is in <b>__ minutes</b>. The clinic is {HoursUntilFivePM()}</p>
        {user && <AppointmentSummary user={user} />}
      </div>
      <div className='content-right'>
        <AccountNotifications user={user} />
      </div>
    </div>
  </div>
  );
}

function ClinicStaff({ user }: ExternalProps) {
  return (
    <div className="Home">
    <div className='home-content'>
      <div className='content-left'>
        <h2 className='welcome'>Welcome Back!</h2>
        <p>No upcoming appointments. The clinic is {HoursUntilFivePM()}</p>
      </div>
      <div className='content-right'>

      </div>
    </div>
  </div>
  );
}

export default Home;