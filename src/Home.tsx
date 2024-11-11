import React from 'react';
import logo from './logo.svg';
import { supabase } from './utils/supabase';
import './styles/Home.css';
import Nav from './components/Nav';

function Home() {
  return (
    <div className="Home">
        <Nav />
    </div>
  );
}

export default Home;
