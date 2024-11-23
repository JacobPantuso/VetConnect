import React from 'react';
import './styles/Appointments.css';
import CurrentAppointments from './CurrentAppointments';
import BookAppointment from './BookAppointment';
import { useUserSession } from './utils/supabase';

function Appointment() {
  const {user, fetching} = useUserSession();

  if (fetching) {
    return (
      <div className="Appointment">
        <h2>Appointments</h2>
        <p className='appt-desc'>No pets have any upcoming appointments.</p>
        <div className='appointment-content'>
          <CurrentAppointments fetching={fetching} />
          <BookAppointment fetching={fetching} />
        </div>    
      </div>
    )
  }

  return (
    <div className="Appointment">
      <h2>Appointments</h2>
      <p className='appt-desc'>No pets have any upcoming appointments.</p>
      <div className='appointment-content'>
        {user && <CurrentAppointments user={user}/> }
        {user && <BookAppointment user={user}/> }
      </div>    
    </div>
  );
}

export default Appointment;
