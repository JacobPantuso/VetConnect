import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import BookAppointment from '../BookAppointment';
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

describe('BookAppointment', () => {
  test('renders BookAppointment component', () => {
    render(
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BookAppointment user={mockUser} />
      </Router>
    );
    expect(screen.getByText('Book Appointment')).toBeInTheDocument();
  });

  test('displays loading state when fetching', () => {
    render(
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BookAppointment user={mockUser} fetching={true} />
      </Router>
    );
    expect(screen.getByText('Book an appointment for your pet.')).toBeInTheDocument();
    expect(screen.getByText('Book Appointment')).toBeInTheDocument();
  });

  test('displays select pet step', () => {
    render(
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BookAppointment user={mockUser} />
      </Router>
    );
    expect(screen.getByText('Select a Pet')).toBeInTheDocument();
  });
});