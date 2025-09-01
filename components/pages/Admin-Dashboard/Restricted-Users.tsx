'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RestrictedUsersProps {
  children: ReactNode;
}

const allowedEmails = [
  'muhammad@beyondhut.com',
  'fahad.aslam4500@gmail.com',
  'mohammad142870@gmail.com',
  'saitthahmedmaqsood@gmail.com',
];

function RestrictedUsers({ children }: RestrictedUsersProps) {
  const router = useRouter();

//   useEffect(() => {
//     if (isLoaded) {
//       const userEmail = user?.primaryEmailAddress?.emailAddress;

//       // If the email is not allowed, redirect to the homepage
//       if (!allowedEmails.includes(userEmail || '')) {
//         router.push('/');
//       }
//     }
//   }, [user, isLoaded, router]);

//   // If user is not loaded yet or email is not allowed, return null
//   if (!isLoaded || !allowedEmails.includes(user?.primaryEmailAddress?.emailAddress || '')) {
//     return null;
//   }

  // Render children if the email is allowed
  return <>{children}</>;
}

export default RestrictedUsers;
