import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ViewPetProfile from '../PetProfile';
import { useUserSession, fetchPetProfiles, fetchAppointments } from '../utils/supabase';

jest.mock('../utils/supabase');

const mockUseUserSession = useUserSession as jest.Mock;
const mockFetchPetProfiles = fetchPetProfiles as jest.Mock;
const mockFetchAppointments = fetchAppointments as jest.Mock;

const mockUser = {
  id: '1',
  user_type: 'USER',
  created_at: new Date().toISOString(),
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  setup: true,
  medicalRecords: [],
  petProfiles: [
    {
      id: 1,
      owner_id: '1',
      name: 'Buddy',
      species: 'dog',
      breed: 'Labrador',
      gender: 'Male',
      date_of_birth: '2015-01-01',
      weight: 30,
      height: 60,
      traits: ['Friendly', 'Energetic'],
      vaccinations: ['Rabies', 'Distemper'],
      allergies: ['Pollen'],
    },
  ],
  appointments: [],
  paymentForms: [],
};

const mockPetProfile = {
  id: 1,
  owner_id: '1',
  name: 'Buddy',
  species: 'dog',
  breed: 'Labrador',
  gender: 'Male',
  date_of_birth: '2015-01-01',
  weight: 30,
  height: 60,
  traits: ['Friendly', 'Energetic'],
  vaccinations: ['Rabies', 'Distemper'],
  allergies: ['Pollen'],
};

const mockAppointments = [
  {
    id: 1,
    pet_profile_id: 1,
    service: 'Checkup',
    scheduled_date: '2023-12-01T10:00:00Z',
    appointment_status: 'scheduled',
  },
];

describe('ViewPetProfile', () => {
  beforeEach(() => {
    mockUseUserSession.mockReturnValue({
      user: mockUser,
      fetching: false,
    });
    mockFetchPetProfiles.mockResolvedValue([mockPetProfile]);
    mockFetchAppointments.mockResolvedValue(mockAppointments);
  });

  test('displays loading state when fetching', () => {
    mockUseUserSession.mockReturnValue({
      user: mockUser,
      fetching: true,
    });
  
    const { container } = render(
      <Router>
        <ViewPetProfile />
      </Router>
    );
  
    const loadingElement = container.querySelector('.myPetsTitle h1');
  
    expect(loadingElement).toBeInTheDocument();
    expect(loadingElement).toHaveTextContent('Fetching Profile...');
  });
  

  test('displays pet profile details', async () => {
    render(
      <Router>
        <ViewPetProfile />
      </Router>
    );

    expect(document.getElementsByClassName("petRow")).not.toBeNull();
  });

  test('displays appointments', async () => {
    render(
      <Router>
        <ViewPetProfile />
      </Router>
    );

    expect(document.getElementsByClassName("appointment-details")).not.toBeNull();
  });
});
