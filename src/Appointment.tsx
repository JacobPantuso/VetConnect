import React from 'react';
import logo from './logo.svg';
import './styles/Appointments.css';
import CurrentAppointments from './CurrentAppointments';
import BookAppointment from './BookAppointment';

function Appointment() {
  return (
    <div className="Appointment">
      <h2>Appointments</h2>
      <p className='appt-desc'>No pets have any upcoming appointments.</p>
      <div className='appointment-content'>
          <CurrentAppointments />
          <BookAppointment />
      </div>    
    </div>
  );
}

export default Appointment;
