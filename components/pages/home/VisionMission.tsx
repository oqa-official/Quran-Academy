"use client";
import { TextAnimate } from "@/components/magicui/text-animate";
import { motion } from "framer-motion";

export default function VisionMission() {
    return (
        <section
            className="relative w-full py-20 text-center text-white max-sm:min-h-[80vh] flex items-center"
            style={{
                backgroundImage: "url('/assets/home/missionbg.png')", // Replace with your background image
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="absolute top-0  right-0">
                <img src="/assets/home/side_design.png" alt="lamp" className="md:w-[300px] w-[280px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                {/* Arabic Verse */}
                <motion.img
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: false }}
                    src="/assets/home/verse3.png"
                    alt="Quran verse"
                    className="mx-auto mb-6"
                />

                {/* Heading */}

                <TextAnimate animation="blurIn" by="word" duration={0.6} as="h2" className="text-2xl md:text-3xl -mt-3 font-bold mb-2 text-white">
                    Our Vision & Mission
                </TextAnimate>

                {/* Divider */}
                <img src="/assets/home/arrow.png" alt="Quran verse" className="w-[200px] text-center mx-auto mb-4" />

                {/* Paragraph */}
                <p className=" text-gray-200">
                    Our mission and vision drive the same intensity towards the Quran,
                    learning and educating millions of people looking to learn and read
                    the Quran, Pronunciation, and Tajweed worldwide. Believe in us as your
                    guide to master the Holy Quran with clarity and confidence.
                </p>
            </div>
        </section>
    );
}
