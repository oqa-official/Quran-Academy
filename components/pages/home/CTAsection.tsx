"use client";

import { motion } from "framer-motion";

import Image from "next/image";

export default function CTASection() {
  return (
    <section className="w-full flex justify-center py-16 px-6 bg-white">
      <div className="max-w-6xl w-full bg-primary text-white rounded-2xl shadow-lg p-10 grid md:grid-cols-2 items-center gap-8">
        {/* Left Content */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold leading-snug">
            Start your<span className="text-accent"> Quran Journey </span> Online Today
          </h2>


          <p className="text-base md:text-lg text-gray-200">
            Join our certified teachers and begin your journey of learning with
            structured courses and flexible timings.
          </p>
          <motion.button
           initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "linear" }}
          viewport={{ once: true }}
          className="bg-accent text-primary px-6 py-3 rounded-full font-medium text-lg hover:opacity-90 transition">
            Enroll Now For Free
          </motion.button>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <Image
            src="/assets/home/quran5.png" 
            alt="Quran Learning"
            width={400}
            height={600}
            className="rounded-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}
