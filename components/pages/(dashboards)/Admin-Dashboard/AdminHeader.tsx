'use client';

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";


export default function DashboardHeader() {
  const { userId, role, clearUser } = useUser();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (!userId || !role) return;

    const fetchName = async () => {
      try {
        let endpoint = "";

        switch (role) {
          case "admin":
            endpoint = `/api/db/admin/${userId}`;
            break;
          case "instructor":
            endpoint = `/api/db/instructors/${userId}`;
            break;
          case "student":
            endpoint = `/api/db/students/${userId}`;
            break;
          default:
            return;
        }

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        setName(data.name.split(" ")[0]);
      } catch (err) {
        console.error(err);
        setName("Name");
      }
    };

    fetchName();
  }, [userId, role]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      clearUser(); // clears context state
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="container px-10 max-md:px-20 bg-primary shadow-md p-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-white">
        { name || "Loading..."}
      </h1>
      <div className="flex items-center gap-4">
        <Button
        variant={'outline'}
          onClick={handleLogout}
          className="font-medium border-accent bg-transparent text-accent hover:text-primary px-6"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
