"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import React from "react";

// Define props interface
interface HeroProps {
  heading: string;
  paragraph: string;
  backgroundImage: string;
}

const Hero: React.FC<HeroProps> = ({ heading, paragraph, backgroundImage }) => {
  const textVariants: Variants = {
    hidden: { opacity: 0, y: -40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative w-full py-16 flex flex-col justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={heading}
          unoptimized
          fill
          className="object-cover transition-opacity duration-[3000ms] ease-in-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-primary to-black/80 opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-row items-center justify-center h-full container text-white">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.3 }}
          className="w-full flex flex-col items-center text-left md:space-y-4 space-y-3"
        >
          <motion.h2
            variants={textVariants}
            className="text-accent text-3xl sm:text-4xl xl:text-5xl text-center"
          >
            {heading}
          </motion.h2>

          <img
            src="/assets/home/arrow.png"
            alt="decorative arrow"
            className="w-[200px] text-center mx-auto mb-2"
          />

          <motion.p
            variants={textVariants}
            className="md:max-w-5xl text-base md:text-lg text-center"
          >
            {paragraph}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
