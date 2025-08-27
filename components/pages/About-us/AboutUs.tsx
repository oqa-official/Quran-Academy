"use client";
import React from 'react';
import { motion } from "framer-motion";
import { TextAnimate } from '@/components/magicui/text-animate';


const AboutUs = () => {
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
                                اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ
                            </h3>
                        </motion.div>


                        <TextAnimate animation="blurIn" by="word" duration={0.6} as="h2" className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                            About Quran Academy
                        </TextAnimate>

                        {/* Decorative arrow/line image */}
                        <img src="/assets/home/arrow.png" alt="Quran verse" className="w-[200px] text-start mb-2" />

                        {/* Description paragraph */}
                        <p className="text-gray-600 mb-6 text-sm md:text-base">
                            The Online Quran Academy is providing the best learning platform on the Internet by offering one-to-one dedicated online Quran courses for everyone in any age group. Professional and certified male or female teachers lead the courses in Arabic and English medium. <br/> <br/>

Advance use of technology with reliable software selection is utilized to interpret the lecture in most convenient format. Main intend is to provide effective and interactive sessions with respect to each student’s pace to offer customized experience.
                        </p>

                        {/* Call-to-action button */}
                        <button className="bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded-md transition-colors duration-300">
                            Start Your Journey With Us
                        </button>
                    </div>

                    {/* Right Column: Image Grid (hidden on small screens) */}
                    <div className="hidden md:flex flex-1 md:max-w-[50%] gap-4 p-1">
                        {/* Top-left image */}
                        <div className="col-span-1 rounded-lg overflow-hidden  transition-transform duration-500 hover:scale-105">
                            <img
                                src="/assets/about/quran.png"
                                alt="Instructor teaching"
                                className="w-[90%] h-auto object-cover mx-auto rounded-md m-1 shadow-md shadow-gray-900"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
