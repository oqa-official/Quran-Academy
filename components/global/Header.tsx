"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { menuItems } from "@/lib/constants/menuitems";
import { BookOpen, LogIn, Mail, PhoneCall, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-white shadow-lg">
      {/* Row 1: Top bar (hidden on mobile) */}
      <div className="hidden md:flex text-black text-base py-2 justify-between container border-b">
        <div className="flex">
          <span className="border-r-2 border-l-2 px-3 flex items-center gap-2">
            <BookOpen size={16} className="text-accent" /> Quran Academy
          </span>
          <span className="border-r-2 px-3 flex items-center gap-2">
            <Mail size={16} className="text-accent" /> OQA.OFFICIAL@GMAIL.COM
          </span>
        </div>

        <div className="flex">
          <span className="border-l-2 px-3 flex items-center gap-2">
            <PhoneCall size={16} className="text-accent" /> 0092 311 4581 622
          </span>
          <span className="border-r-2 border-l-2 px-3 flex items-center gap-2">
            <LogIn size={16} className="text-accent" /> Login
          </span>
        </div>
      </div>

      {/* Row 2: Main header */}
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          LOGO
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-gray-600">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center gap-1 transition ${
                  isActive ? "text-accent" : "text-gray-500 hover:text-primary"
                }`}
              >
                <Icon
                  size={18}
                  className={`transition ${
                    isActive
                      ? "text-accent fill-accent"
                      : " hover:text-primary-hover text-primary fill-primary hover:fill-primary-hover"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <Button size={'lg'} className="hidden md:block rounded-full px-10 bg-primary hover:bg-primary-hover">
          Free Trial
        </Button>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:text-primary"
              >
                <Menu size={28} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[400px] px-10">
              <SheetHeader>
              </SheetHeader>

              {/* Mobile top row */}
              <div className="mt-6 space-y-4">
                <div className="flex flex-col gap-2 text-sm border-b pb-4">
                  <span className="flex items-center gap-2">
                    <BookOpen size={16} className="text-accent" /> Quran Academy
                  </span>
                  <span className="flex items-center gap-2">
                    <Mail size={16} className="text-accent" /> OQA.OFFICIAL@GMAIL.COM
                  </span>
                  <span className="flex items-center gap-2">
                    <PhoneCall size={16} className="text-accent" /> 0092 311 4581 622
                  </span>
                  <span className="flex items-center gap-2">
                    <LogIn size={16} className="text-accent" /> Login
                  </span>
                </div>

                {/* Mobile Nav */}
                <nav className="flex flex-col gap-4">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-3 transition ${
                          isActive ? "text-accent" : "text-gray-600 hover:text-primary"
                        }`}
                      >
                        <Icon
                          size={20}
                          className={`transition ${
                            isActive
                              ? "text-accent fill-accent"
                              : "text-gray-500 hover:text-primary hover:fill-primary"
                          }`}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* CTA */}
                <Button className="w-full rounded-full bg-primary hover:bg-primary-hover">
                  Free Trial
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
