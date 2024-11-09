import React, { useEffect } from 'react'
import supabase from '../config/supabaseClient';
import {Auth} from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';




function Login() {
    
    const navigate = useNavigate();

    useEffect(() => {
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          navigate('/home');
        }
      });
  
      return () => {
        authListener?.unsubscribe;
      };
    }, [navigate]);
  
  return (
    <div  className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>
        <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa,
            style: {
                button: { backgroundColor: '#2DD4BF', color: 'white', borderColor:'#2DD4BF', },
                root: {
                    backgroundColor: '#e7e5e4',
                  },
            }
         }}
        theme="default"
        providers={[]}
       />
        </div>
    </div>
  )
}

export default Login;