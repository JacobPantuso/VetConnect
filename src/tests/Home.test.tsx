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
});