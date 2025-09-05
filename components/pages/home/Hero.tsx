"use client";

import { Button } from "@/components/ui/button";
import { usePopup } from "@/context/PopupContext";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const images = [
  "/assets/home/hero1.png",
  "/assets/home/hero6.png",
  "/assets/home/hero3.png",
  "/assets/home/hero4.png",
];

export default function Hero() {
    const { setOpen } = usePopup();
  const [current, setCurrent] = useState(0);

  // Auto-slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Variants with proper typing
  const textVariants: Variants = {
    hidden: { opacity: 0, y: -40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.6 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  return (
    <section className="relative w-full md:min-h-[100vh]  flex flex-col justify-center max-md:py-20 max-md:pb-24 md:pb-10 overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {images.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt="Quran Academy"
            unoptimized
            fill
            priority={index === 0}
            className={`object-cover transition-opacity duration-[3000ms] ease-in-out ${index === current ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-primary to-black/80 opacity-70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center  md:gap-10 justify-between h-full container text-white">
        {/* Left Content */}
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.3 }}
          className="w-full md:w-1/2 flex flex-col items-start text-left space-y-8"
        >
          <motion.h1
            variants={textVariants}
            className="text-3xl sm:text-4xl xl:text-6xl font-bold leading-tight"
          >
            Choose the Right Path for{" "}
            <span className="text-accent">Quranic Education</span>
          </motion.h1>

          <motion.p
            variants={textVariants}
            className="max-w-xl text-lg md:text-xl italic"
          >
            Build a stronger connection with the Quran through guided online
            classes
          </motion.p>

          <motion.div variants={textVariants}>
              <Button
                size={"lg"}
                onClick={() => setOpen(true)}
                className="bg-accent hover:bg-accent-hover text-black md:py-6 py-2 md:px-10 px-6 text-lg rounded-full transition"
              >
                Enroll Now For Free
              </Button>
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={imageVariants}
          className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0 relative max-md:mt-14"
        >
          {/* Glowing background */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-tr from-yellow-400/40 to-yellow-200/20 blur-3xl opacity-80 animate-pulse" />
          </div>

          {/* Image */}
          <Image
            src="/assets/home/quran.png"
            alt="Hero Quran"
            width={500}
            height={500}
            className="w-[75%] max-w-md object-contain relative z-10"
          />
        </motion.div>
      </div>

      {/* Wavy Shape Divider */}
      <div className="absolute -bottom-2 md:-bottom-2 left-0 right-0 z-20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          className="w-full h-[100px] rotate-180"
        >
          <g fill="white">
            <path
              d="M500 80.7C358 68 0 4 0 4V0h1000v84.7c-216 23.3-358 8.6-500-4Z"
              opacity=".3"
            ></path>
            <path
              d="M500 65.7C358 53 0 4 0 4V0h1000v62.7c-216 23.3-358 15.6-500 3Z"
              opacity=".5"
            ></path>
            <path d="M500 50.7C358 38 0 4 0 4V0h1000v40.7C784 64 642 63.3 500 50.7Z"></path>
          </g>
        </svg>
      </div>
    </section>
  );
}
