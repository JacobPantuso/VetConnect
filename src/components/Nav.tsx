import React from 'react';
import { supabase, useUserSession } from '../utils/supabase';
import '../styles/Nav.css';
import { Link } from 'react-router-dom';

function Nav() {
  const {user, fetching} = useUserSession();

  if (fetching) {
    return (
      <div className="Nav">
        <div className='left'>
          <img src={'./paw.png'} className="logo" alt="logo" />
          <div className='logo-right'>
            <h2>VetConnect</h2>
            <p>Your Trusted Partner in Vet Care.</p>
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
          <p>Your Trusted Partner in Vet Care.</p>
        </div>        
      </div>
      <div className='right'>
        <Link to='/appointments'>Appointments</Link>
        <Link to='/pet-profiles'>Pet Profiles</Link>
        <Link to='/resources'>Resources</Link>
        <Link to='/about'>About</Link>
        <div className='profile'>
          <div className='profile-pic'>
            <img src={'https://static.vecteezy.com/system/resources/thumbnails/020/911/740/small_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png'} alt="profile" />
          </div>
          <div className='profile-info'>
            <Link to='/profile'>My Profile</Link>
            <p onClick={() => supabase.auth.signOut()}>Sign Out</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
