// components/Footer.tsx
'use client';
import { motion } from "framer-motion";
import { menuItems } from "@/lib/constants/menuitems";
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex flex-col">

      <div className="bg-primary relative   text-white max-sm:py-10 overflow-hidden">
        <div className="absolute top-0 right-0">
          <motion.img
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            viewport={{ once: false }}
            src="/assets/home/lamp2.png"
            alt="lamp"
            className="md:w-[200px] w-[100px] scale-x-[-1]"
          />
        </div>



        {/* First Row */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/20">
          {/* Logo */}
          <div>
            <h2 className="text-2xl font-bold text-accent">Quran Acedemy</h2>
            <p className="mt-3 text-sm text-white/80">
              Build a stronger connection with the Quran through guided online classes
            </p>
          </div>

          {/* Newsletter */}
          <div className="flex justify-start items-start` flex-col">
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <form className="flex flex-col justify-start items-start gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="text-white px-4 py-2 rounded-sm w-[70%] outline-white outline-1"
              />
              <button className="bg-accent text-black hover:bg-white hover:text-primary transition px-4 py-2 rounded-lg font-medium">
                Subscribe
              </button>
            </form>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="hover:text-accent transition">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-accent transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition">Support</a></li>
              <li><a href="#" className="hover:text-accent transition">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Second Row */}
        <div className="max-w-7xl mx-auto px-6 py-6 border-b border-white/20 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Contact Info */}
          <div className="flex flex-col md:flex-row gap-2">
            <p className="flex items-center gap-2">
              <Phone size={18} className="text-accent" /> +92 300 1234567
            </p>
            <p className="flex items-center gap-2">
              <Mail size={18} className="text-accent" /> support@example.com
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent transition"><Facebook /></a>
            <a href="#" className="hover:text-accent transition"><Twitter /></a>
            <a href="#" className="hover:text-accent transition"><Instagram /></a>
            <a href="#" className="hover:text-accent transition"><Linkedin /></a>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-white/70 text-sm">
          © {new Date().getFullYear()} Quran Acedemy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
