import React from 'react';
import logo from './logo.svg';
import { supabase } from './utils/supabase';
import './styles/Home.css';

function Home() {
  return (
    <div className="App">
        <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
    </div>
  );
}

export default Home;
