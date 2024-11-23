import React, {useState, useEffect} from 'react';
import { Session } from '@supabase/supabase-js'
import { supabase, useUserSession } from './utils/supabase';
import './styles/App.css';
import Auth from './Auth';
import Home from './Home';
import AccountSetup from './AccountSetup';
import Gateway from './components/Gateway';
import {Route, Routes, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Appointment from './Appointment';
import About from './About';
import Resources from './Resources';
import MyPets from './MyPets';
import PetProfile from './PetProfile';
import CreatePetProfile from './CreatePetProfile';
import UserProfile from './components/UserProfile';
import Footer from './Footer';
import Payment from './Payment';

function App() {

  const { user, fetching } = useUserSession();
  const [session, setSession] = useState<Session | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (initialLoading || fetching) {
    return <Gateway />;
  }

  if (!session) {
    return <Auth />;
  }

  if (user && !user.setup) {
    return <AccountSetup />;
  }

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointments" element={<Appointment />} />
        <Route path={`/profile/${user?.id}`} element={<UserProfile user={user ?? undefined} />} />
        <Route path="/about" element={<About />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/mypets" element={<MyPets />} />
        <Route path="/petprofile" element={<PetProfile/>}/>
        <Route path="/createpetprofile" element={<CreatePetProfile/>}/>
        <Route path="/payment/:paymentid" element={<Payment />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
