"use client";
import React from 'react';
import { motion } from "framer-motion";
import { TextAnimate } from '@/components/magicui/text-animate';


const WhyGoForUs = () => {
    return (
        // Main container with a light background and padding
        <section className="bg-gray-100 py-16 container">
            <div className=" mx-auto px-4 md:px-8 lg:px-12">
                {/*
          Two-column layout for medium and larger screens,
          stacking vertically on small screens.
        */}
                <div className="flex flex-col md:flex-row items-center gap-10">

                    {/* Left Column: Content section */}
                    <div className="flex-1 md:max-w-[50%] flex flex-col items-center md:items-start text-center md:text-left">
                        {/* Arabic verse image */}
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            viewport={{ once: true }} // run only first time in view
                        >
                            <h3 className="font-arabic text-2xl md:text-3xl font-thin mb-4 text-accent">
                                خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
                            </h3>
                        </motion.div>


                        <TextAnimate animation="blurIn" by="word" duration={0.6} as="h2" className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                            Why Go With Us?
                        </TextAnimate>

                        {/* Decorative arrow/line image */}
                        <img src="/assets/home/arrow.png" alt="Quran verse" className="w-[200px] text-start mb-2" />

                        {/* Description paragraph */}
                        <p className="text-gray-600 mb-6">
                            Quran Academy  has found a fantastic way to teach its client base through online Quran teaching classes. We are experienced, trustworthy and have been spreading the light of the Quran by educating millions of students and people worldwide via professional Quran tutors.
                        </p>

                        {/* Call-to-action button */}
                        <button className="bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded-md transition-colors duration-300">
                            Get Enrolled Now
                        </button>
                    </div>

                    {/* Right Column: Image Grid (hidden on small screens) */}
                    <div className="hidden md:flex flex-1 md:max-w-[50%] gap-4">
                        {/* Top-left image */}
                        <div className="col-span-1 rounded-lg overflow-hidden  transition-transform duration-500 hover:scale-105">
                            <img
                                src="/assets/home/quran4.png"
                                alt="Instructor teaching"
                                className="w-[90%] h-auto object-cover mx-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyGoForUs;
