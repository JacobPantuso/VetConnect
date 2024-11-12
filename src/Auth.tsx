import React from "react";
import "./styles/Auth.css"
import { supabase } from './utils/supabase'
import { Auth as AuthProvider } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

function Auth() {
    
    return (
        <div className="Auth">
            <div className="auth-container">
                <div className="auth-box">
                    <img className="logo" src="./paw.png" alt="VetConnect Logo" />
                    <h2>VetConnect</h2>
                    <p>Sign in to access your profile.</p>
                    <div className="wrapper">
                        <AuthProvider
                                supabaseClient={supabase} 
                                socialLayout="horizontal" 
                                providers={[]}
                                appearance={{
                                    theme: ThemeSupa,
                                    variables: {
                                        default: {
                                          colors: {
                                            brand: '#00000',
                                            brandAccent: '#2e8e38',
                                          },
                                        },
                                      },
                                }}
                                theme="dark"
                        />
                    </div>
                </div>
                <footer>
                        &copy; 2024 VetConnect - All Rights Reserved
                </footer>
            </div>
        </div>
    )
}

export default Auth;