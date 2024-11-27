import React, { useEffect, useState } from "react";
import '../styles/Summary.css';
import { fetchAppointments, User, Appointment, PetProfile, fetchPetProfiles } from '../utils/supabase';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import LineChart from "./LineChart";
import { ModifyAppointment } from "../CurrentAppointments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faInfoCircle, faSync } from "@fortawesome/free-solid-svg-icons";

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
          <p className="loading" style={{ width: '250px' }}></p>
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

  if (user?.user_type === 'CS' || user?.user_type === 'VET') {
    return <FullAppointmentSummary user={user} />;
  }

  let daysUntilAppointment = 0;
  let petName;
  const data = {
    datasets: [
      {
        data: [65, 0],
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

  if (user?.user_type === 'USER' && user.appointments.length > 0) {
    const upcomingScheduledDate = user?.appointments[0]?.scheduled_date.split(" ")[0];
    const today = new Date();
    const upcomingDate = upcomingScheduledDate ? new Date(upcomingScheduledDate) : null;
    daysUntilAppointment = upcomingDate ? Math.floor((upcomingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    petName = user?.petProfiles.filter((profile) => profile.id === user.appointments[0].pet_profile_id)[0].name;
    if (daysUntilAppointment < 0) {
      data.datasets[0].data = [65, 0]
    } else {
      data.datasets[0].data = [daysUntilAppointment, 65 - daysUntilAppointment];
    }
  }

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
          : <p>No pets have upcoming appointments</p>}
        <div className="details">
          <div className="chart-left">
            <Doughnut data={data} options={options} />
            <div className="inside-chart">
              {daysUntilAppointment === 0 ? (
                  <>
                  <div>{petName}</div>
                  <div className="due-in">today.</div>
                  </>
                ) : (
                  daysUntilAppointment > 0 ? (
                    <>
                    <div>{petName}</div>
                    <div className="due-in">in {daysUntilAppointment} days.</div>
                    </>
                  ) : (
                    <div className="due-in">No Appointments</div>
                  )
                )
              }
            </div>
          </div>
          <div className="breakdown">
            {user?.appointments.slice(0, 2).map((appointment) =>
              (appointment.appointment_status === 'scheduled') && (
                <LineChart
                  key={appointment.id}
                  amount={(30-(daysUntilAppointment))/30*100}
                  pet_name={user.petProfiles.find(profile => profile.id === appointment.pet_profile_id)?.name || ''}
                  field={appointment.service}
                />
              ))}
            {(user?.appointments.filter((appointment) => appointment.appointment_status === 'scheduled').length ?? 0) <= 1 && (
              <div className="thats-all">
                <FontAwesomeIcon icon={faInfoCircle} />
                <p>No other updates for today.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type ExternalProps = {
  user: User;
};

export function FullAppointmentSummary({ user }: ExternalProps) {
  const [appointments, setAppointments] = useState([] as Appointment[]);
  const [cachedAppointments, setCachedAppointments] = useState([] as Appointment[]);
  const [petProfiles, setPetProfiles] = useState([] as PetProfile[]);
  const [selected, setSelected] = useState('today');
  const [loading, setLoading] = useState(true);
  const [showModify, setShowModify] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const appointments = await fetchAppointments({});
      const petProfiles = await fetchPetProfiles();
      const filteredAppointments = appointments.filter(
        (appointment) => appointment.appointment_status === "scheduled"
      );
  
      setCachedAppointments(filteredAppointments);
      setPetProfiles(petProfiles);
  
      if (selected === "today") {
        setAppointments(
          filteredAppointments.filter(
            (appointment) =>
              new Date(appointment.scheduled_date.split(" ")[0]).toDateString() ===
              new Date().toDateString()
          )
        );
      } else if (selected === "week") {
        const today = new Date();
        const first = today.getDate() - today.getDay();
        const firstDay = new Date(today.setDate(first));
        const lastDay = new Date(today.setDate(first + 6));
  
        setAppointments(
          filteredAppointments.filter(
            (appointment) =>
              new Date(appointment.scheduled_date.split(" ")[0]) >= firstDay &&
              new Date(appointment.scheduled_date.split(" ")[0]) <= lastDay
          )
        );
      } else {
        setAppointments(cachedAppointments);
      }
  
      setLoading(false); // Only set loading to false after all operations
    };
  
    fetchData();
  }, [selected]);
  

  if (loading) {
    return (
      <div className="Summary full">
        <div className="appointment-summary-content">
          <h2>Appointment Summary</h2>
          <p className="loading" style={{ width: '250px' }}></p>
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

  return (
    <div className="Summary full">
      <div className="appointment-summary-content full">
        <h2>Appointment Summary</h2>
        <select className="appointment-filter" value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="all">All Appointments</option>
        </select>
        {appointments.length > 0 ? (
          <div className="appointments">
            {appointments.map((appointment) => {
                return (
                  <div key={appointment.id} className="appointment">
                    <div className="left">
                      <div className="pet-img">
                        <img
                          src="https://media.istockphoto.com/id/474486193/photo/close-up-of-a-golden-retriever-panting-11-years-old-isolated.jpg?s=612x612&w=0&k=20&c=o6clwQS-h6c90AHlpDPC74vAgtc_y2vvGg6pnb7oCNE="
                          alt={"test"}
                        />
                      </div>
                      <div className="appointment-details">
                        <h3>
                          {appointment.service} for{" "}
                          {
                            petProfiles.filter(
                              (profile) =>
                                profile.id === appointment.pet_profile_id
                            )[0].name
                          }
                        </h3>
                        <p>
                          <b>Scheduled:</b>{" "}
                          {new Date(
                            appointment.scheduled_date.split(" ")[0]
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          from {appointment.scheduled_date.slice(10)}
                        </p>
                      </div>
                    </div>
                    <div className="appt-right">
                      <button
                        className="modify"
                        onClick={() => setShowModify(!showModify)}
                      >
                        <FontAwesomeIcon icon={faCalendarDay} /> &nbsp; Modify
                        Appointment
                      </button>
                      {showModify && (
                        <ModifyAppointment
                          user={user}
                          appointment={appointment}
                          setShowModify={setShowModify}
                        />
                      )}
                    </div>

                  </div>
                );
              })}
              
          </div>
        ) : (
          <div className="no-appointments full">
            <FontAwesomeIcon icon={faCalendarDay} size="4x" />
            <p>
              There are no appointments to display with that filter selected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentSummary;