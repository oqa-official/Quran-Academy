"use client";

import Link from "next/link";
import { usePopup } from "@/context/PopupContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
import { motion, Variants } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { UserInfo } from "@/app/(dashboards)/admin_dashboard/componnets/UserInfo";

export default function Header() {
  const { userId, loading } = useUser();
  const { setOpen } = usePopup();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Auto-close mobile nav on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

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

          {!userId ?
            <Link href={'/auth/login'}>
              <span className="border-r-2 border-l-2 px-3 flex items-center gap-2 hover:scale-[1.01] transition-transform">
                <LogIn size={16} className="text-accent" /> Login
              </span>
            </Link>

            :
          

            <div>
              <UserInfo/>
            </div>
          }

        </div>
      </div>

      {/* Row 2: Main header */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container flex items-center justify-between py-4"
      >
        {/* Logo */}
        <motion.div variants={item}>
          <Link href="/" className="text-xl font-bold text-primary">
            LOGO
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <motion.nav
          variants={container}
          className="hidden md:flex gap-6 text-gray-600 "
        >
          {menuItems.map((itemData) => {
            const Icon = itemData.icon;
            const isActive = pathname === itemData.href;
            return (
              <motion.div key={itemData.label} variants={item}>
                <Link
                  href={itemData.href}
                  className={`flex flex-col items-center gap-1 transition ${isActive ? "text-accent" : "text-gray-500 hover:text-primary hover:scale-[1.02]"
                    }`}
                >
                  <Icon
                    size={16}
                    className={`transition ${isActive
                        ? "text-accent fill-accent"
                        : "hover:text-primary-hover text-primary fill-primary hover:fill-primary-hover"
                      }`}
                  />
                  <span>{itemData.label}</span>
                  <span className="text-[10px] -mt-2 capitalize">
                    {itemData.desc}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        {/* CTA */}
        <motion.div variants={item}>
          <Button
            size={"lg"}
            onClick={() => setOpen(true)}
            className="hidden md:block rounded-full px-10 bg-primary hover:bg-primary-hover"
          >
            Free Trial
          </Button>
        </motion.div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button size="icon" className="text-white hover:bg-accent">
                <Menu size={30} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[400px] px-10">
              <SheetHeader />
              <SheetTitle></SheetTitle>
              <div className="mt-6 space-y-4">
                {/* Mobile top row */}
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
                </div>

                {/* Mobile Nav */}
                <nav className="flex flex-col gap-4">
                  {menuItems.map((itemData) => {
                    const Icon = itemData.icon;
                    const isActive = pathname === itemData.href;
                    return (
                      <Link
                        key={itemData.label}
                        href={itemData.href}
                        className={`flex items-center gap-3 transition ${isActive
                            ? "text-accent"
                            : "text-gray-600 hover:text-primary"
                          }`}
                      >
                        <Icon
                          size={20}
                          className={`transition ${isActive
                              ? "text-accent fill-accent"
                              : "hover:text-primary-hover text-primary fill-primary hover:fill-primary-hover"
                            }`}
                        />
                        {itemData.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* CTA */}
                {!userId &&
                  <Button onClick={() => setOpen(true)} className="w-full rounded-full bg-primary hover:bg-primary-hover">
                    Free Trial
                  </Button>
                }


                <Link href={'/auth/login'}>
                  <Button className="w-full rounded-full bg-accent hover:bg-accent-hover text-primary">
                    {userId ? "Dashboard" : "Login"}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>
    </header>
  );
}
