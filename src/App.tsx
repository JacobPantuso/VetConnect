import React, {useState, useEffect} from 'react';
import { createClient, Session } from '@supabase/supabase-js'
import { supabase } from './utils/supabase';
import logo from './logo.svg';
import './styles/App.css';
import Auth from './Auth';
import Home from './Home';

function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])


  if (!session) {
    return (
      <Auth />
    )
  } else {
    return (
      <Home />
    );
  }
}

export default App;
