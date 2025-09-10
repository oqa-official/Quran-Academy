// UserContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the type for the data you will be providing through the context.
interface UserContextType {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}

// Define the type for the provider's props.
interface UserProviderProps {
  children: ReactNode;
}

// Create the context with an initial value of null.
const UserContext = createContext<UserContextType | null>(null);

// The provider component that will wrap your app.
export const UserProvider = ({ children }: UserProviderProps) => {
  const [userId, setUserId] = useState<string>('68c07d7b16ffe946fdae0d85');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, you would make an API call here to get the user's data
    // based on an auth token, then set the userId state.
    // For this example, we'll just simulate a delay.
    const timer = setTimeout(() => {
      setUserId('68c07d7b16ffe946fdae0d85'); // Still using the static ID for this demo
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // The value object contains the data you want to make available.
  const value: UserContextType = { userId, setUserId, loading };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// A custom hook to easily consume the context in any component.
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
