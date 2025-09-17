"use client";

import { MenuIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UserInfo } from "./UserInfo";
import { ModeToggle } from "@/components/global/MoodToogler";

type HeaderProps = {
  onToggleSidebar?: () => void;
};

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className=" w-full top-0 z-1 flex items-center justify-between border-b border-stroke bg-white dark:bg-[#122031] px-4 py-5 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      {/* Sidebar toggle (mobile) */}
      <button
        onClick={onToggleSidebar}
        className="rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-[#122031] hover:dark:bg-[#FFFFFF1A] lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      

      {/* Title */}
      <div className="max-xl:hidden">
        <h1 className="mb-0.5 font-poppins text-heading-5 font-bold text-dark dark:text-white">
         Dashboard
        </h1>
        <p className="font-medium">Quran Academy Management</p>
      </div>

      {/* Right section */}
      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        {/* Search */}
        <div className="relative w-full max-w-[300px]">
          <input
            type="search"
            placeholder="Search"
            className="flex w-full items-center gap-3.5 rounded-full border bg-gray-2 py-3 pl-[53px] pr-5 outline-none transition-colors focus-visible:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:border-dark-4 dark:hover:bg-dark-3 dark:focus-visible:border-primary"
          />
          <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 max-[1015px]:size-5" />
        </div>

        {/* Theme toggle */}
        <ModeToggle />

        {/* User info */}
        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
