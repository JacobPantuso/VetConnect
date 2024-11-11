import React from 'react';
import { supabase, useUserSession } from '../utils/supabase';
import '../styles/Nav.css';

function Nav() {
  const {user, fetching} = useUserSession();

  if (fetching) {
    return (
      <div className="Nav">
        <div className='left'>
          <img src={'./paw.png'} className="logo" alt="logo" />
          <div className='logo-right'>
            <h2>VetConnect</h2>
            <p>Vet Made Easy.</p>
          </div>        
        </div>
        <div className='right'>
          <p>Appointments</p>
          <p>Pet Profiles</p>
          <p>Resources</p>
          <p>About</p>
          <div className='profile'>
            <div className='profile-pic'>
              <div className='loading' style={{width: '50px', height: '50px', borderRadius: '50%'}}></div>
            </div>
            <div className='profile-info'>
              <p className='loading'></p>
              <p className='loading' style={{width: '50px', height: '10px'}}></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="Nav">
      <div className='left'>
        <img src={'./paw.png'} className="logo" alt="logo" />
        <div className='logo-right'>
          <h2>VetConnect</h2>
          <p>Vet Made Easy.</p>
        </div>        
      </div>
      <div className='right'>
        <p>Appointments</p>
        <p>Pet Profiles</p>
        <p>Resources</p>
        <p>About</p>
        <div className='profile'>
          <div className='profile-pic'>
            <img src={user?.user_metadata.avatar_url || './paw.png'} alt="profile" />
          </div>
          <div className='profile-info'>
            <p>My Profile</p>
            <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
