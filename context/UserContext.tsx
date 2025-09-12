// // UserContext.tsx
// "use client";

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// // Define the type for the data you will be providing through the context.
// interface UserContextType {
//   userId: string;
//   setUserId: React.Dispatch<React.SetStateAction<string>>;
//   loading: boolean;
// }

// // Define the type for the provider's props.
// interface UserProviderProps {
//   children: ReactNode;
// }

// // Create the context with an initial value of null.
// const UserContext = createContext<UserContextType | null>(null);

// // The provider component that will wrap your app.
// export const UserProvider = ({ children }: UserProviderProps) => {
//   const [userId, setUserId] = useState<string>('68c07d7b16ffe946fdae0d85');
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     // In a real app, you would make an API call here to get the user's data
//     // based on an auth token, then set the userId state.
//     // For this example, we'll just simulate a delay.
//     const timer = setTimeout(() => {
//       setUserId('68c07d7b16ffe946fdae0d85'); // Still using the static ID for this demo
//       setLoading(false);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, []);














"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  userId: string | null;
  role: string | null;
  setUser: (id: string, role: string) => void;
  clearUser: () => void;
  loading: boolean;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true); // make sure loading is true while fetching
        const res = await fetch("/api/session"); // get cookie session
        if (res.ok) {
          const data = await res.json();
          setUserId(data.userId || null);
          setRole(data.role || null);
        } else {
          setUserId(null);
          setRole(null);
        }
      } catch (err) {
        console.error("Failed to fetch session", err);
        setUserId(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const setUser = (id: string, role: string) => {
    setUserId(id);
    setRole(role);
  };

  const clearUser = () => {
    setUserId(null);
    setRole(null);
  };

  return (
    <UserContext.Provider value={{ userId, role, setUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
