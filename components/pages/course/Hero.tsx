"use client";

import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import Image from "next/image";


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
        <section className="relative w-full py-16  flex flex-col justify-center  overflow-hidden">
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
                    className="w-full md:w-1/2 flex flex-col items-start text-left md:space-y-7 space-y-3"
                >
                    <p className="text-2xl font-medium leading-tight">Read, Learn, Memorize and Revise</p>
                    <motion.h2
                        variants={textVariants}
                        className="text-2xl font-bold leading-tight"
                    >
                        <span className="text-accent text-3xl sm:text-4xl xl:text-5xl">Online Quran Courses</span>
                    </motion.h2>

                    <motion.p
                        variants={textVariants}
                        className="max-w-xl text-base md:text-lg"
                    >
                       We warmly welcome all genders to come and understand the Holy Quran under our expertise.
                    </motion.p>
                   
                </motion.div>



                {/* Right Image */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={imageVariants}
                    className="w-full md:w-1/2 flex justify-center md:mt-0 relative"
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
                        className="hidden md:flex w-[65%%] max-w-[300px]  object-contain relative z-10"
                    />
                </motion.div>
            </div>


        </section>
    );
}
