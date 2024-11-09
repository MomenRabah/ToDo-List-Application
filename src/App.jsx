import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OngoingTasks from './pages/OngoingTasks';
import CompletedTasks from './pages/CompletedTasks';
import Dashboard from './pages/Dashboard';
import { QueryClient, QueryClientProvider } from 'react-query';
import supabase from './config/supabaseClient';
import LoginPage from './pages/LoginPage';

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: userData } = supabase.auth.getUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Listen for changes in user session
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session ? session.user : null);
    });

    return () => {
      authListener?.unsubscribe;
    };
  }, []);
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: user ? (
        <HomePage user={user} />
      ) : (
        <LoginPage />
      ),
      children: [
        {
          path: '/tasks/ongoing',
          element: <OngoingTasks user={user} />,
        },
        {
          path: '/tasks/completed',
          element: <CompletedTasks user={user} />,
        },
        {
          path: '/home',
          element: <Dashboard user={user} />,
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
