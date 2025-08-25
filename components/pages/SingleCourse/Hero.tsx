"use client";

import { NumberTicker } from "@/components/magicui/number-ticker";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { User } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";


export default function Hero() {


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
        <section className="relative w-full min-h-[110vh] md:min-h-[100vh] flex flex-col justify-center  overflow-hidden">
            {/* Background Carousel */}
            <div className="absolute inset-0 ">
                <Image
                    src={"/assets/home/hero1.png"}
                    alt="Quran Academy"
                    unoptimized
                    fill
                    className={`object-cover transition-opacity duration-[3000ms] ease-in-out`}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-primary to-black/80 opacity-70"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center md:gap-5 justify-between h-full container text-white">
                {/* Left Content */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    transition={{ staggerChildren: 0.3 }}
                    className="w-full md:w-1/2 flex flex-col items-start text-left space-y-7"
                >
                    <motion.h1
                        variants={textVariants}
                        className="text-3xl sm:text-4xl xl:text-6xl font-bold leading-tight"
                    >
                        Learn Quranic Studies for beginner

                        {" "}
                        <span className="text-accent"></span>
                    </motion.h1>

                    <motion.p
                        variants={textVariants}
                        className="max-w-xl text-lg md:text-xl italic"
                    >
                        Learn the art of Quranic recitation with clarity and confidence.
                    </motion.p>

                    {/* Stats */}
                    <div className="flex justify-center items-center divide-x-2 divide-accent self-start -ms-10 my-10">
                        <div className="flex flex-col justify-center items-center px-6">
                           <div className="flex  items-center gap-2">
                                <p className="text-2xl">⭐</p>
                                <NumberTicker
                                value={4.9}
                                decimalPlaces={1}
                                className="text-xl md:text-3xl whitespace-pre-wrap tracking-tighter text-white"
                            />
                             </div>
                            <p className="text-center">Average Rating</p>
                        </div>

                        <div className="flex flex-col justify-center items-center px-6">
                                <NumberTicker
                                value={20}
                                className="text-xl md:text-3xl whitespace-pre-wrap tracking-tighter text-white"
                            />
                            <p className="text-center">Practice Exercises</p>
                        </div>

                        <div className="flex flex-col justify-center items-center px-6">
                             <NumberTicker
                                value={8}
                                className="text-xl md:text-3xl whitespace-pre-wrap tracking-tighter text-white"
                            />
                            <p className="text-center">Classes / Month</p>
                        </div>
                    </div>


                    <motion.div variants={textVariants}>
                        <Button
                            size={"lg"}
                            className="bg-accent hover:bg-accent-hover text-black md:py-6 py-2 md:px-10 px-6 text-lg rounded-full transition"
                        >
                            Enroll In This Course
                        </Button>
                    </motion.div>

                    <div className="flex justify-start text-accent gap-2">
                        <User fill="#F4B400" />
                        1K+ students already enrolled
                    </div>
                </motion.div>



                {/* Right Image */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={imageVariants}
                    className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0 relative"
                >
                    {/* Glowing background */}
                    <div className="absolute inset-0 flex justify-center items-center">
                        <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-tr from-yellow-400/40 to-yellow-200/20 blur-3xl opacity-80 animate-pulse" />
                    </div>

                    {/* Image */}
                    <Image
                        src="/assets/courses/calligraphy.png"
                        alt="Hero Quran"
                        width={800}
                        height={800}
                        className="w-[75%] xl:w-full max-w-md object-contain relative z-10"
                    />
                </motion.div>
            </div>


        </section>
    );
}
