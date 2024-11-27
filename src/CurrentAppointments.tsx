import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faDollarSign,
  faDownload,
  faInfoCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  User,
  Appointment,
  PaymentForm,
  fetchAppointments,
  updateAppointment,
  deleteAppointment,
  downloadInvoice
} from "./utils/supabase";
import { useNavigate } from "react-router-dom";
import { CustomDatePicker } from "./BookAppointment";

interface CurrentAppointmentsProps {
  user: User;
  fetching?: boolean;
}

function CurrentAppointments({ user, fetching }: CurrentAppointmentsProps) {
  const [showModify, setShowModify] = React.useState(false);
  const navigate = useNavigate();

  if (fetching) {
    return (
      <div className="CurrentAppointments">
        <h2>Current Appointments</h2>
        <p className="loading" style={{ width: "250px" }}></p>
        <div className="booking">
          <div className="loading-circle"></div>
        </div>
      </div>
    );
  }

  const handleDownload = async (paymentFormId: number) => {
    const invoiceUrl = await downloadInvoice(paymentFormId);
  
    if (invoiceUrl) {
      window.open(invoiceUrl, "_blank");
    }
  };

  const handlePayment = (payment: PaymentForm) => {
    navigate(`/payment/${payment.appointment_id}`);
  };

  return (
    <div className="CurrentAppointments">
      <h2>Current Appointments</h2>
      {user.appointments.filter(
        (appointment) => appointment.appointment_status === "scheduled"
      ).length > 0 ? (
        <div className="appointments">
          {user.appointments
            .filter(
              (appointment) => appointment.appointment_status === "scheduled"
            )
            .map((appointment) => {
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
                          user.petProfiles.filter(
                            (profile) =>
                              profile.id === user.appointments[0].pet_profile_id
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
        <div className="no-appointments">
          <FontAwesomeIcon icon={faCalendarDay} size="4x" />
          <p>
            You currently have no appointments. If you'd like to book an
            appointment, you can do so by using the form on this page.
          </p>
        </div>
      )}
      <h2 style={{marginTop: '1rem'}}>Completed Appointments</h2>
      <div className="appointments">
        {user.paymentForms.map((payment) => {
          const appointment = user.appointments.filter(
            (appointment) => appointment.id === payment.appointment_id
          )[0];
          return (
            <div key={appointment.id} className="appointment">
              <div className="appt-left-payment">
                <div className="pet-img">
                  <img
                    src="https://media.istockphoto.com/id/474486193/photo/close-up-of-a-golden-retriever-panting-11-years-old-isolated.jpg?s=612x612&w=0&k=20&c=o6clwQS-h6c90AHlpDPC74vAgtc_y2vvGg6pnb7oCNE="
                    alt={"test"}
                  />
                </div>
                <div className="appointment-details">
                  <h3>
                    {appointment.service} for {user.petProfiles.filter(
                                                (profile) => profile.id === user.appointments[0].pet_profile_id
                                              )[0].name}
                  </h3>
                  <p>
                    <b>Completed:</b>{" "}
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
              <div className="appt-right-payment">
                {payment.status === "paid" ? (
                  <>
                  <p>
                    <b>Paid:</b> ${payment.charge}
                  </p>                  
                  <button className="pay" onClick={() => handleDownload(payment.id)}>
                    <FontAwesomeIcon icon={faDownload} /> Download Invoice
                  </button>
                  </>
                ): (
                  <>
                  <p>
                    <b>Total Due:</b> ${payment.charge}
                  </p>
                  <button className="pay" onClick={() => handlePayment(payment)}>
                    <FontAwesomeIcon icon={faDollarSign} /> &nbsp; Pay Balance
                  </button>
                  </>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type ModifyAppointmentProps = {
  user: User;
  appointment: Appointment;
  setShowModify: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ModifyAppointment({
  user,
  appointment,
  setShowModify,
}: ModifyAppointmentProps) {
  const [selectedAction, setSelectedAction] = React.useState("");
  return (
    <div className="ModifyAppointment">
      <div className="modify-container">
        <FontAwesomeIcon
          className="close"
          icon={faTimesCircle}
          onClick={() => setShowModify(false)}
        />
        <h2>Modify Appointment</h2>
        <p>
          You are {selectedAction !== "" ? selectedAction : "modifying"}{" "}
          {
            user.petProfiles.filter(
              (profile) => profile.id === appointment.pet_profile_id
            )[0].name
          }
          's appointment.
        </p>
        {selectedAction === "" && (
                  <div className="note">
                  <div className="top-row-note">
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <h5>NOTE</h5>
                  </div>
                  <p>
                    If you wish to change the service associated with an appointment you
                    must cancel and rebook the appointment.
                  </p>
                </div> 
        )}
        <div className="modify-form">
          {selectedAction === "" && (
            <div className="selection">
              <h3>Select an Action</h3>
              <select onChange={(e) => setSelectedAction(e.target.value)}>
                <option value="">Select an action</option>
                <option value="rescheduling">Reschedule Appointment</option>
                <option value="canceling">Cancel Appointment</option>
                {user.user_type !== 'USER' && (<option value='complete'>Complete Appointment</option>)}
              </select>
              {selectedAction && (
                <p>Changing your selection will void any current changes.</p>
              )}
            </div>
          )}
          {selectedAction === "rescheduling" && (
            <Reschedule
              appointment={appointment}
              setSelectAction={setSelectedAction}
            />
          )}
          {selectedAction === "canceling" && (
            <CancelAppointmentForm
              appointment={appointment}
              setSelectAction={setSelectedAction}
              selectedAction="cancel"
            />
          )}
          {selectedAction === "complete" && (
            <CancelAppointmentForm
              appointment={appointment}
              setSelectAction={setSelectedAction}
              selectedAction="complete"
            />
          )}
        </div>
      </div>
    </div>
  );
}

type RescheduleProps = {
  appointment: Appointment;
  setSelectAction: React.Dispatch<React.SetStateAction<string>>;
};

export function Reschedule({ appointment, setSelectAction }: RescheduleProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // For the newly selected date
  const [availableTimes, setAvailableTimes] = useState<string[]>([]); // To store regenerated time slots
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [confirmChanges, setConfirmChanges] = useState(false);

  useEffect(() => {
    fetchAppointments({}).then((appointments) => {
      setAllAppointments(appointments);
    });
  }, []);

  const formatTime = (hours: number, minutes: number) => {
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    const formattedMinutes = minutes.toString().padStart(2, "0")
    return `${formattedHours}:${formattedMinutes} ${ampm}`
  };

  const generateTimeSlots = () => { 
    if (!selectedDate) {
      return []; // No date selected, no time slots to generate
    }
  
    const durationMatch = appointment.service.match(/\((\d+)\s*(Hour|Minutes)\)/i); // Regex to match the duration
    let duration = 30; // Default to 30 minutes if no match
    if (durationMatch) {
      const value = parseInt(durationMatch[1], 10); // Extract numeric value
      const unit = durationMatch[2].toLowerCase(); // Extract unit (hour/minutes)
      duration = unit === "hour" ? value * 60 : value; // Convert to minutes if in hours
    }
  
    const slots: string[] = [];
    const dateAppointments = allAppointments.filter(
      (appointment) => appointment.scheduled_date.split(" ")[0] === selectedDate
    );
  
    let currentTime = new Date();
    currentTime.setHours(9, 0, 0, 0); // Start at 9:00 AM
  
    while (currentTime.getHours() < 17) {
      const start = formatTime(
        currentTime.getHours(),
        currentTime.getMinutes()
      );
      currentTime.setMinutes(currentTime.getMinutes() + duration); // Add duration
      if (currentTime.getHours() >= 17 && currentTime.getMinutes() > 0) break; // Stop after 5:00 PM
      const end = formatTime(currentTime.getHours(), currentTime.getMinutes());
      const slotStart = new Date(`${selectedDate} ${start}`).getTime();
      const slotEnd = new Date(`${selectedDate} ${end}`).getTime();
  
      const isSlotAvailable = !dateAppointments.some((appointment) => {
        const appointmentDate = appointment.scheduled_date.split(" ")[0];
        const appointmentTimeRange = appointment.scheduled_date.slice(10);
        if (appointmentDate !== selectedDate) return false; // Skip appointments on different dates
  
        const appointmentStartTime = appointmentTimeRange.split(" - ")[0];
        const appointmentEndTime = appointmentTimeRange.split(" - ")[1];
        const appointmentStart = new Date(`${appointmentDate} ${appointmentStartTime}`).getTime();
        const appointmentEnd = new Date(`${appointmentDate} ${appointmentEndTime}`).getTime();
  
        return (
          (slotStart >= appointmentStart && slotStart < appointmentEnd) || // Slot start overlaps
          (slotEnd > appointmentStart && slotEnd <= appointmentEnd) || // Slot end overlaps
          (slotStart <= appointmentStart && slotEnd >= appointmentEnd) // Slot completely covers appointment
        );
      });
  
      if (isSlotAvailable) {
        slots.push(`${start} - ${end}`);
      }
    }
  
    return slots;
  };

  const handleSelectTime = (
    time: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.currentTarget.classList.toggle("selected");
    setCurrentTime(time);
  };

  const handleDateSelection = (date: string) => {
    setSelectedDate(date);
    setAvailableTimes(generateTimeSlots());
    setShowDatePicker(false);
  };

  useEffect(() => {
    if (selectedDate) {
      const availableSlots = generateTimeSlots();
      setAvailableTimes(availableSlots); // Update the available time slots
    }
  }, [selectedDate, allAppointments]);

  const handleReschedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.setAttribute("disabled", "true");
    updateAppointment(appointment.id, {
      scheduled_date: `${selectedDate} ${currentTime}`,
    }).then(() => {
      window.location.reload();
    });
  }

  if (confirmChanges) {
    return (
      <div className="Reschedule">
        <h3>Appointment Confirmation</h3>
        <p> Your appointment will be rescheduled to&nbsp;
          {selectedDate && new Date(selectedDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })} from{" "}
          {currentTime}.
        </p>
        <div className="button-row">
          <button
            className="back-to-selection"
            onClick={() => {
              setSelectAction("rescheduling")
              setConfirmChanges(false)
            }}
          >
            Go Back
          </button>
          <button className="confirm-changes" onClick={(e) => handleReschedule(e)}>Confirm Changes</button>
        </div>
      </div>
    );
  }

  return (
    <div className="Reschedule">
      <p style={{ marginTop: "1rem" }}>
        <b>Current Appointment:</b> <br />
        {new Date(appointment.scheduled_date.split(" ")[0]).toLocaleDateString(
          "en-US",
          { year: "numeric", month: "long", day: "numeric" }
        )}{" "}
        from {appointment.scheduled_date.slice(10)}
      </p>
      <div
        className={`date-picker-container resch ${
          availableTimes.length > 0 ? "times-on" : ""
        }`}
      >
        <div
          className={`date-input resch`}
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          {selectedDate || "Select a Date"}
        </div>
        {showDatePicker && (
          <div className={`date-picker-popup resch`}>
            <CustomDatePicker
              onDateSelect={handleDateSelection}
              prevDate={appointment.scheduled_date}
            />
          </div>
        )}
      </div>
      {selectedDate && (
        <div className="time-slots-resch">
          <h3>Available Times on {selectedDate}</h3>
          <div className="time-slots-container resch">
            {availableTimes.length > 0 ? (
              availableTimes.map((time) => (
                <button
                  key={time}
                  className={`time-slot-button ${
                    time === currentTime ? "selected" : ""
                  }`}
                  onClick={(e) => handleSelectTime(time, e)}
                >
                  {time}
                </button>
              ))
            ) : (
              <p>No available times for the selected date.</p>
            )}
          </div>
        </div>
      )}
      <div className="button-row">
        <button
          className="back-to-selection"
          onClick={() => setSelectAction("")}
        >
          Go Back
        </button>
        <button
          className="confirm-changes"
          disabled={!selectedDate || !currentTime}
          onClick={() => setConfirmChanges(true)}
        >
          Confirm Changes
        </button>
      </div>
    </div>
  );
}

type CancelProps = {
  appointment: Appointment;
  setSelectAction: React.Dispatch<React.SetStateAction<string>>;
  selectedAction?: string;
};

export function CancelAppointmentForm({ appointment, setSelectAction, selectedAction }: CancelProps) {
  const handleCancel = () => {
    deleteAppointment(appointment).then(() => {
      window.location.reload();
    });
  }
  const handleComplete = () => {
    updateAppointment(appointment.id, { appointment_status: "completed" }).then(() => {
      window.location.reload();
    });
  }
  return (
    <div className="CancelAppointmentForm">
      <h4>Are you sure?</h4>
      { selectedAction === 'complete' ? (
        <p>You're about to complete an appointment. <br></br>You cannot undo this change.</p>
      ) : (
        <p>You're about to cancel an appointment. <br></br>You cannot undo this change.</p>
      )

      }
      <div className="button-row">
        <button
          className="back-to-selection cancel"
          onClick={() => setSelectAction("")}
        >
          Go Back
        </button>
        {selectedAction === 'complete' ? (
          <button
            onClick={handleComplete}
            className="confirm-changes cancel"
          >
            Complete Appointment
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="confirm-changes cancel"
          >
            Cancel Appointment
          </button>
        )}
      </div>
    </div>
  );
}

export default CurrentAppointments;
