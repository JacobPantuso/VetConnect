import React from 'react';
import { useUserSession } from './utils/supabase';
import './styles/Home.css';
import Nav from './components/Nav';

function Home() {
  const { user, fetching } = useUserSession();

  if (fetching) {
    return (
      <div className="Home">
          <div className='home-content'>
            <p className='loading' style={{width:'250px', height: '30px'}}></p>
            <p className='loading' style={{width:'320px', height: '20px'}}></p>
          </div>
      </div>
    );
  }

  return (
    <div className="Home">
        <div className='home-content'>
          <h2>Welcome, {user?.first_name}!</h2>
        </div>
    </div>
  );
}

export default Home;