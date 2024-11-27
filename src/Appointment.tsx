import React, { useEffect, useState } from 'react';
import './styles/Appointments.css';
import CurrentAppointments from './CurrentAppointments';
import BookAppointment from './BookAppointment';
import { useUserSession, User, fetchAllUsers, fetchAppointments, fetchPaymentForms, fetchPetProfiles } from './utils/supabase';

function Appointment() {
  const { user, fetching } = useUserSession();
  const [selectedUser, setSelectedUser] = useState(null as User | null);
  const [allUsers, setAllUsers] = useState([] as User[]);

  useEffect(() => {
    if (user?.user_type !== 'USER') {
      fetchAllUsers().then((users) => {
        setAllUsers(users);
      });
    }
  }, [user])

  const handleUserSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = allUsers.filter((user) => user.id === e.target.value)[0];
  
    if (!selectedUser) {
      console.error("User not found");
      return;
    }
  
    try {
      const [appointments, petProfiles, paymentForms] = await Promise.all([
        fetchAppointments({ ownerId: selectedUser.id }),
        fetchPetProfiles(selectedUser.id),
        fetchPaymentForms({ ownerId: selectedUser.id })
      ]);
  
      setSelectedUser({
        ...selectedUser,
        appointments,
        petProfiles,
        paymentForms});
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  

  if (fetching) {
    return (
      <div className="Appointment">
        <h2>Appointments</h2>
        <p className='appt-desc'>No pets have any upcoming appointments.</p>
        <div className='appointment-content'>
          <CurrentAppointments user={{
            id: '',
            created_at: '',
            first_name: '',
            last_name: '',
            email: '',
            user_type: '',
            setup: true,
            petProfiles: [],
            appointments: [],
            medicalRecords: [],
            paymentForms: []
          }} fetching={fetching} />
          <BookAppointment user={{
            id: '',
            created_at: '',
            first_name: '',
            last_name: '',
            email: '',
            user_type: '',
            setup: true,
            petProfiles: [],
            appointments: [],
            medicalRecords: [],
            paymentForms: []
          }} fetching={fetching} />
        </div>
      </div>
    )
  }
  return (
    <div className="Appointment">
      <h2>Appointments</h2>
      {user?.user_type === 'USER' ?
        user && user.appointments.filter(
          (appointment) => appointment.appointment_status === "scheduled"
        ).length > 0
          ? `${user.petProfiles.filter(
            (profile) => profile.id === user.appointments[0].pet_profile_id
          )[0].name
          } has an upcoming appointment on ${new Date(
            user.appointments[0].scheduled_date.split(" ")[0]
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`
          : <p className='appt-desc'>No pets have upcoming appointments</p>
        :
        <p className='appt-desc'>Book an appointment for a customer below.</p>}
      {user?.user_type !== 'USER' && (
        <select className='user-select'  onChange={(e) => { handleUserSelect(e) }}>
          <option value=''>Select a customer</option>
          {allUsers.map((user) => (
            user.user_type === 'USER' && (<option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>)
          ))}
        </select>
      )}
      <div className='appointment-content'>
        {(user && user.user_type === 'USER') && <CurrentAppointments user={user} />}
        {(user?.user_type !== 'USER' && selectedUser) && <BookAppointment user={selectedUser} />}
        {(user?.user_type === 'USER') && <BookAppointment user={user} />}
      </div>
    </div>
  );
}

export default Appointment;
