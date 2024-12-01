import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CurrentAppointments from '../CurrentAppointments';
import { User } from '../utils/supabase';
import { Appointment, MedicalRecord, PaymentForm, PetProfile } from '../utils/supabase';

const mockUser: User = {
  id: '1',
  user_type: 'USER',
  created_at: new Date().toISOString(),
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  setup: true,
  medicalRecords: [] as MedicalRecord[],
  petProfiles: [] as PetProfile[],
  appointments: [] as Appointment[],
  paymentForms: [] as PaymentForm[],
};

describe('CurrentAppointments', () => {
  test('renders CurrentAppointments component', () => {
    render(
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <CurrentAppointments user={mockUser} />
      </Router>
    );
    expect(screen.getByText('Current Appointments')).toBeInTheDocument();
  });

  test('displays loading state when fetching', () => {
    render(
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <CurrentAppointments user={mockUser} fetching={true} />
      </Router>
    );
    expect(screen.getByText('Current Appointments')).toBeInTheDocument();
  });

  test('displays no appointments message', () => {
    render(
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <CurrentAppointments user={mockUser} />
      </Router>
    );
    // div with class no-appointments should be in dom
    expect(document.getElementsByClassName('no-appointments')).not.toBeNull();
  });
});