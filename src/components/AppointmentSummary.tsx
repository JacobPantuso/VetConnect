import React from "react";
import '../styles/Summary.css';
import { User } from '../utils/supabase';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import LineChart from "./LineChart";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AppointmentSummaryProps {
  user?: User;
  fetching?: boolean;
}

function AppointmentSummary({ user, fetching }: AppointmentSummaryProps) {

    if (fetching) {
      return (
        <div className="Summary">
          <div className="appointment-summary-content">
            <h2>Appointment Summary</h2>
            <p className="loading" style={{width: '250px'}}></p>
              <div className="details">
                  <div className="chart-left">
                    <div className="loading-circle"></div>
                  </div>
                  <div className="breakdown">

                  </div>
              </div>
          </div>
        </div>
      )
    }
    const upcomingScheduledDate = user?.appointments[0]?.scheduled_date.split(" ")[0];
    const today = new Date();
    const upcomingDate = upcomingScheduledDate ? new Date(upcomingScheduledDate) : null;
    const daysUntilAppointment = upcomingDate ? Math.floor((upcomingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const petName = user?.petProfiles.filter((profile) => profile.id === user.appointments[0].pet_profile_id)[0].name;

    const data = {
      datasets: [
        {
          data: [365-daysUntilAppointment, daysUntilAppointment],
          backgroundColor: ['#41924a', '#d3d3d3'],
          borderWidth: 0,
          cutout: '70%', 
          rotation: 0,
        },
      ],
    };
  
    const options = {
      plugins: {
        tooltip: { enabled: false },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
    return (
        <div className="Summary">
          <div className="appointment-summary-content">
              <h2>Appointment Summary</h2>
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
              <div className="details">
                  <div className="chart-left">
                      <Doughnut data={data} options={options} />
                      <div className="inside-chart">
                          <div>{petName}</div>
                          <div className="due-in">in {daysUntilAppointment} days</div>
                      </div>
                  </div>
                  <div className="breakdown">
                    {user?.appointments.slice(0, 2).map((appointment) => 
                      (appointment.appointment_status === 'scheduled') && (
                      <LineChart 
                      key={appointment.id} 
                      amount={((365-daysUntilAppointment)/365)*100} 
                      pet_name={user.petProfiles.find(profile => profile.id === appointment.pet_profile_id)?.name || ''} 
                      field={appointment.service} 
                      />
                    ))}
                  </div>
              </div>
          </div>
        </div>
    );
}

export default AppointmentSummary;