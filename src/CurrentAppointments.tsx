import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faDollarSign, faInfoCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { User } from './utils/supabase'
import { useNavigate } from "react-router-dom";

type PaymentForms = {
  id: number;
  created_at: string;
  owner: string;
  pet_id: number;
  charge: number;
  appointment: number;
  notes: string;
  status: string;
}

type Appointment = {
  id: number;
  scheduled_date: string;
  pet_profile_id: number;
  veterinarian: number;
  appointment_status: string;
  service: string;
}

interface CurrentAppointmentsProps {
  user?: User;
  fetching?: boolean;
}

function CurrentAppointments({user, fetching}: CurrentAppointmentsProps) {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [paymentForms, setPaymentForms] = React.useState<PaymentForms[]>([]);
  const [showModify, setShowModify] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAppointments([
      {
        id: 1,
        scheduled_date: '2025-01-15 10:00AM-11:00AM',
        pet_profile_id: 1,
        veterinarian: 1,
        appointment_status: 'payment_pending',
        service: 'Annual Checkup'
      }
    ]);
    if (appointments.length > 1) {
      setAppointments(appointments.sort((a, b) => {
        return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime();
      }));
    }
    setPaymentForms([
      {
        id: 1,
        created_at: '2024-01-01',
        owner: 'John Doe',
        pet_id: 1,
        charge: 100,
        appointment: 1,
        notes: 'Annual checkup',
        status: 'paid'
      }
    ]);
  }, []);

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

  const handlePayment = (payment: PaymentForms) => {
    navigate(`/payment/${payment.id}`);
  }

  return (
    <div className="CurrentAppointments">
      <h2>Current Appointments</h2>
      <p>
        {appointments.filter(appointment => appointment.appointment_status !== "payment_pending").length > 0
          ? `${appointments[0].pet_profile_id} has an upcoming appointment on ${new Date(appointments[0].scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
          : 'No pets have upcoming appointments'}
      </p>
      {appointments.filter(appointment => appointment.appointment_status !== "payment_pending").length > 0
        ?
        <div className="appointments">
          {appointments
          .filter(appointment => appointment.appointment_status !== "payment_pending") 
          .map(appointment => {
            return (
              <div key={appointment.id} className="appointment">
                <div className="left">
                  <div className="pet-img">
                    <img src="https://media.istockphoto.com/id/474486193/photo/close-up-of-a-golden-retriever-panting-11-years-old-isolated.jpg?s=612x612&w=0&k=20&c=o6clwQS-h6c90AHlpDPC74vAgtc_y2vvGg6pnb7oCNE=" alt={"test"} />
                  </div>
                  <div className="appointment-details">
                    <h3>{appointment.service} for {appointment.pet_profile_id}</h3>
                    <p>{new Date(appointment.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="appt-right">
                  <button className="modify" onClick={() => setShowModify(!showModify)}>
                    <FontAwesomeIcon icon={faCalendarDay} /> &nbsp;
                    Modify Appointment
                  </button>
                  {showModify && <ModifyAppointment appointment={appointment} setShowModify={setShowModify} />}
                </div>
              </div>
            )
          })}
        </div>
        :
        <div className="no-appointments">
          <FontAwesomeIcon icon={faCalendarDay} size="4x" />
          <p>You currently have no appointments. 
            If you'd like to book an appointment, you can do so by using the form on this page.</p>
        </div>
      }
      <h2>Completed Appointments</h2>
      <div className="appointments">
        {appointments.filter(appointment => appointment.appointment_status === "payment_pending").map(appointment => {
          return (
            <div key={appointment.id} className="appointment">
              <div className="left">
                <div className="pet-img">
                  <img src="https://media.istockphoto.com/id/474486193/photo/close-up-of-a-golden-retriever-panting-11-years-old-isolated.jpg?s=612x612&w=0&k=20&c=o6clwQS-h6c90AHlpDPC74vAgtc_y2vvGg6pnb7oCNE=" alt={"test"} />
                </div>
                <div className="appointment-details">
                  <h3>{appointment.service} for {appointment.pet_profile_id}</h3>
                    <p><b>Completed:</b> {new Date(appointment.scheduled_date.split(' ')[0] + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} from {appointment.scheduled_date.split(' ')[1]}</p>
                </div>
              </div>
              <div className="appt-right-payment">
                <p><b>Total Due:</b> ${paymentForms.filter(payment => payment.appointment === appointment.id)[0]?.charge}</p>
                <button className="pay" onClick={()=>handlePayment(paymentForms.filter(payment => payment.appointment === appointment.id)[0])}>
                  <FontAwesomeIcon icon={faDollarSign} /> &nbsp;
                  Pay Balance
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type ModifyAppointmentProps = {
  appointment: Appointment;
  setShowModify: React.Dispatch<React.SetStateAction<boolean>>;
}

function ModifyAppointment({appointment, setShowModify}: ModifyAppointmentProps) {
  const [selectedAction, setSelectedAction] = React.useState('');
  return (
    <div className="ModifyAppointment">
      <div className="modify-container">
        <FontAwesomeIcon className="close" icon={faTimesCircle} onClick={() => setShowModify(false)} />
        <h2>Modify Appointment</h2>
        <p>You are {selectedAction !== '' ? selectedAction : 'modifying'} {appointment.pet_profile_id}'s appointment.</p>
        <div className="note">
          <div className="top-row-note">
            <FontAwesomeIcon icon={faInfoCircle} />
            <h5>NOTE</h5>
          </div>
          <p>If you wish to change the service associated with an appointment you must cancel and rebook the appointment.</p>
        </div>
        <div className="modify-form">
          {selectedAction === '' && (
          <div className="selection">
            <h3>Select an Action</h3>
            <select  onChange={(e) => setSelectedAction(e.target.value)}>
              <option value="">Select an action</option>
              <option value="rescheduling">Reschedule Appointment</option>
              <option value="canceling">Cancel Appointment</option>
            </select>
            {selectedAction && <p>Changing your selection will void any current changes.</p>}
          </div>
          )}
          {selectedAction === 'rescheduling' && (<Reschedule appointment={appointment} setSelectAction={setSelectedAction} />)}
          {selectedAction === 'canceling' && (<CancelAppointmentForm appointment={appointment} setSelectAction={setSelectedAction} />)}
        </div>
      </div>
    </div>
  );
}

type RescheduleProps = {
  appointment: Appointment;
  setSelectAction: React.Dispatch<React.SetStateAction<string>>;
}

function Reschedule({appointment, setSelectAction}: RescheduleProps) {

  return (
    <div className="Reschedule">
      <p><b>Current Appointment:</b> <br></br>{new Date(appointment.scheduled_date.split(' ')[0] + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} from {appointment.scheduled_date.split(' ')[1]}</p>
      <div className="button-row">
        <button className="back-to-selection" onClick={() => setSelectAction('')}>Go Back</button>
        <button className="confirm-changes" >Confirm Changes</button>
      </div>
    </div>
  );
}

type CancelProps = {
  appointment: Appointment;
  setSelectAction: React.Dispatch<React.SetStateAction<string>>;
}

function CancelAppointmentForm({appointment, setSelectAction}: CancelProps) {
  return (
    <div className="CancelAppointmentForm">
      <h4>Are you sure?</h4>
      <p></p>
      <div className="button-row">
        <button className="back-to-selection" onClick={() => setSelectAction('')}>Go Back</button>
        <button className="confirm-changes" >Cancel Appointment</button>
      </div>
    </div>
  );
}

export default CurrentAppointments;