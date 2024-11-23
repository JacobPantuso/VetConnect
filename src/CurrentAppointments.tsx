import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { User } from './utils/supabase'

interface CurrentAppointmentsProps {
  user?: User;
  fetching?: boolean;
}

function CurrentAppointments({user, fetching}: CurrentAppointmentsProps) {
  const [appointments, setAppointments] = React.useState([]);
  
  if (fetching) {
    return (
      <div className="CurrentAppointments">
        <h2>Current Appointments</h2>
        <p className="loading" style={{width: '250px'}}></p>
        <div className="booking">
          <div className="loading-circle"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="CurrentAppointments">
      <h2>Current Appointments</h2>
      <p>No pets have any upcoming appointments.</p>
      {
        appointments.length > 0
        ?
        <div className="appointments">
        </div>
        :
        <div className="no-appointments">
          <FontAwesomeIcon icon={faCalendarDay} size="4x" />
          <p>You currently have no appointments. 
            If you'd like to book an appointment, you can do so by using the form on this page.</p>
        </div>
      }
    </div>
  );
}

export default CurrentAppointments;