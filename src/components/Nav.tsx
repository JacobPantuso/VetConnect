import React, {useState} from 'react';
import { supabase, useUserSession } from '../utils/supabase';
import '../styles/Nav.css';
import { Link } from 'react-router-dom';

function Nav() {
  const {user, fetching} = useUserSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

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
          <p>Dashboard</p>
          <p>Appointments</p>
          <p>Pet Profiles</p>
          <p>Resources</p>
          <p>About</p>
          <div className='profile'>
            <div className='profile-pic-loading'>
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
      <div className="left">
        <img src={'./paw.png'} className="logo" alt="logo" />
        <div className="logo-right">
          <Link to="/" className="dashboard">VetConnect</Link>
          <p>Your Trusted Partner in Vet Care.</p>
        </div>
      </div>
      <button className={menuOpen ? 'hamburger open' : 'hamburger'} onClick={toggleMenu}>
        ☰
      </button>
      <div className={`right ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={toggleMenu}>Dashboard</Link>
        <Link to="/appointments" onClick={toggleMenu}>Appointments</Link>
        <Link to="/pet-profiles" onClick={toggleMenu}>Pet Profiles</Link>
        <Link to="/resources" onClick={toggleMenu}>Resources</Link>
        <Link to="/about" onClick={toggleMenu}>About</Link>
        <div className="profile">
          <div className="profile-pic">
            <p>{user?.first_name?.charAt(0).toUpperCase()}</p>
            <p>{user?.last_name?.charAt(0).toUpperCase()}</p>
          </div>
          <div className="profile-info">
            <Link to={`/profile/${user?.id}`} onClick={toggleMenu}>My Profile</Link>
            <p onClick={() => supabase.auth.signOut()}>Sign Out</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
