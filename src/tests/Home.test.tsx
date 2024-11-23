import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from '../Home';
import { useUserSession } from '../utils/supabase';

jest.mock('../utils/supabase');

describe('Home Component', () => {
    it('renders loading state correctly', () => {
        (useUserSession as jest.Mock).mockReturnValue({ user: null, fetching: true });
    
        render(<Home />);
    
        const loadingElements = document.getElementsByClassName('loading'); 
        expect(loadingElements).not.toBeNull();
        expect(loadingElements.length).toBeGreaterThan(0);
    });
    

    it('renders CS user correctly', () => {
        (useUserSession as jest.Mock).mockReturnValue({ user: { user_type: 'CS' }, fetching: false });
        render(<Home />);
        expect(screen.getByText(/Welcome Back!/i)).toBeInTheDocument();
        expect(screen.getByText(/No upcoming appointments/i)).toBeInTheDocument();
    });

    it('renders VET user correctly', () => {
        (useUserSession as jest.Mock).mockReturnValue({ user: { user_type: 'VET', first_name: 'John', last_name: 'Doe' }, fetching: false });
        render(<Home />);
        expect(screen.getByText(/Welcome, John. Doe!/i)).toBeInTheDocument();
        expect(screen.getByText(/Your next appointment is in/i)).toBeInTheDocument();
    });

    it('renders default user correctly', () => {
        (useUserSession as jest.Mock).mockReturnValue({ user: { first_name: 'Jane' }, fetching: false });
        render(<Home />);
        expect(screen.getByText(/Welcome, Jane!/i)).toBeInTheDocument();
        expect(screen.getByText(/No pets have any upcoming appointments/i)).toBeInTheDocument();
    });
});