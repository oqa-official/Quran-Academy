// "use client";

// import { Skeleton } from '@/components/ui/skeleton';
// import { useUser } from '@/context/UserContext';
// import { useRouter } from 'next/navigation';
// import React from 'react';

// interface RestrictedUsersProps {
//   children: React.ReactNode;
//   allowedRoles: string[]; // e.g. ["admin"], ["student"], ["teacher"], or multiple
// }

// export default function RestrictedUsers({ children, allowedRoles }: RestrictedUsersProps) {
//   const router = useRouter();
//   const { role, loading } = useUser();

//   if (loading) {
//     return (
//       <div className="container my-10 flex h-[80vh] justify-center items-start gap-5 flex-col">
//         <Skeleton className="w-full min-h-[30vh] bg-primary" />
//         <Skeleton className="w-[90%] min-h-[10vh] bg-primary" />
//         <Skeleton className="w-[80%] min-h-[5vh] bg-primary" />
//         <Skeleton className="w-[50%] min-h-[5vh] bg-primary" />
//       </div>
//     );
//   }

//   if (!role || !allowedRoles.includes(role)) {
//     router.push("/");
//     return null; // 🚫 block access if not allowed
//   }

//   return <>{children}</>;
// }





"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface RestrictedUsersProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RestrictedUsers({ children, allowedRoles }: RestrictedUsersProps) {
  const router = useRouter();
  const { role, loading } = useUser();

  // 🔹 Redirect logic in useEffect
  useEffect(() => {
    if (!loading && (!role || !allowedRoles.includes(role))) {
      router.push("/"); // redirect if role not allowed
    }
  }, [role, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="container my-10 flex h-[80vh] justify-center items-start gap-5 flex-col">
        <Skeleton className="w-full min-h-[30vh] bg-primary" />
        <Skeleton className="w-[90%] min-h-[10vh] bg-primary" />
        <Skeleton className="w-[80%] min-h-[5vh] bg-primary" />
        <Skeleton className="w-[50%] min-h-[5vh] bg-primary" />
      </div>
    );
  }

  // 🔹 Block access until redirect happens
  if (!role || !allowedRoles.includes(role)) {
    return null; // render nothing
  }

  return <>{children}</>;
}
