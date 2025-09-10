"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gray-100">
      {/* Quran Verse */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-lg md:text-2xl text-accent  mb-6"
      >
        إِنَّا لِلّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
      </motion.p>

      {/* 404 Number */}
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-7xl md:text-9xl font-extrabold text-accent "
      >
        404
      </motion.h1>

      {/* Message */}
      <p className=" text-lg text-gray-300">
        Page Not Found
      </p>

      {/* Illustration */}
      <div className="relative w-80 h-80">
        <Image
          src="/assets/home/not-found.svg" // 👉 put an illustration in public/illustrations
          alt="Not Found Illustration"
          fill
          className="object-contain"
        />
      </div>

      {/* Back to Home Button */}
      <Link href="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl shadow-lg transition"
        >
          Go Back Home
        </motion.button>
      </Link>
    </div>
  );
}
