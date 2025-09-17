"use client";

import { useEffect, useState } from "react";
import { ChevronUpIcon, LogOut, Settings, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useTheme } from "next-themes";

export function UserInfo() {
    const { setTheme } = useTheme()
  const [open, setOpen] = useState(false);
  const { role, userId, clearUser } = useUser();
  const [userData, setUserData] = useState<{ name: string; email: string }>({
    name: "Loading...",
    email: "Loading...",
  });

  // Fetch user details
  useEffect(() => {
    if (!role || !userId) return;

    const fetchUser = async () => {
      try {
        let endpoint = "";
        switch (role) {
          case "admin":
            endpoint = `/api/db/admin/${userId}`;
            break;
          case "student":
            endpoint = `/api/db/students/${userId}`;
            break;
          case "instructor":
            endpoint = `/api/db/instructors/${userId}`;
            break;
          default:
            return;
        }

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        setUserData({ name: data.name, email: data.email });
      } catch (err) {
        console.error("User fetch error", err);
        setUserData({ name: "Unknown", email: "Not available" });
      }
    };

    fetchUser();
  }, [role, userId]);

  

  const handleLogout = async () => {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
    
    // Force reset theme back to light
    setTheme("light");

    localStorage.removeItem("theme");

    clearUser();
  } catch (err) {
    console.error("Logout failed", err);
  }
};


  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="rounded outline-none ring-primary ring-offset-2 focus-visible:ring-1">
        <span className="sr-only">My Account</span>
        <figure className="flex items-center gap-3">
          <Image
            src="/assets/global/user.jpg"
            className="size-8 rounded-full"
            alt="Avatar"
            width={100}
            height={100}
          />
          <figcaption className="flex items-center gap-1 font-medium text-foreground max-[1024px]:sr-only">
            <span>{userData.name}</span>
            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                open && "rotate-0"
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="border border-border bg-background shadow-md min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src="/assets/global/user.jpg"
            className="size-8 rounded-full"
            alt="Avatar"
            width={100}
            height={100}
          />
          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-foreground">
              {userData.name}
            </div>
            <div className="leading-none text-muted-foreground">
              {userData.email}
            </div>
          </figcaption>
        </figure>

        <hr className="border-border" />

        {role && role=='admin' && 
          <div className="p-2 text-base text-muted-foreground [&>*]:cursor-pointer">
          <Link
            href="/admin_dashboard/profile"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-muted/50 hover:text-foreground"
          >
            <UserIcon />
            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>

          <Link
            href="/admin_dashboard/profile"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-muted/50 hover:text-foreground"
          >
            <Settings />
            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>
        </div>
        }

      

        <hr className="border-border" />

        <div className="p-2 text-base text-muted-foreground">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-muted/50 hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut />
            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
