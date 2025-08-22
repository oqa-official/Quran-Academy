'use client'
import Image from "next/image";
import { TextAnimate } from "@/components/magicui/text-animate";
import { motion } from "framer-motion";

export default function HowItWorks() {
    const steps = [
        {
            id: "01",
            title: "Easy Online Registration",
            desc: "Provide basic details and complete your registration in just a few minutes.",
            icon: "/assets/home/step2.png",
        },
        {
            id: "02",
            title: "Schedule Free Trial",
            desc: "Pick a convenient time for your free class and meet your instructor online.",
            icon: "/assets/home/step1.png",
        },
        {
            id: "03",
            title: "Start Your Journey",
            desc: "Log in with your credentials and begin your Quran learning journey with us.",
            icon: "/assets/home/step3.png",
        },
    ];

    return (
        <section
            className="relative py-20 bg-white"
        >
            {/* Background image with opacity */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: "url('/assets/home/bg_pattern.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.5, //  control opacity here
                }}
            ></div>

            {/* Content */}
            <div className="relative container mx-auto px-6 lg:px-12 text-center">
                {/* Arabic Verse */}
                <motion.img
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: false }}
                    src="/assets/home/verse2.png"
                    alt="Quran verse"
                    className="mx-auto mb-6"
                />

                {/* Heading */}

                <TextAnimate animation="blurIn" by="word" duration={0.6} as="h2" className="text-2xl md:text-3xl -mt-3 font-bold mb-2 text-primary">
                    Begin Learning Quran Now in 3 Easy Steps
                </TextAnimate>
                <img
                    src="/assets/home/arrow.png"
                    alt="Quran verse"
                    className="w-[200px] text-center mx-auto mb-2"
                />
                <p className="text-gray-600 max-w-2xl mx-auto mb-12">
                    We developed an extremely simple registration process to get yourself
                    or your children started. Just follow these steps and begin your journey.
                </p>

                {/* Steps */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {steps.map((step, i) => (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1, ease: "easeOut" , delay: i * 0.6 }}
                            viewport={{ once: true }}
                            key={i}
                            className="bg-white border rounded-2xl shadow-md p-5 text-center cursor-pointer 
            hover:shadow-xl hover:-translate-y-2 transition duration-300"
                        >
                            <div className="flex justify-center mb-4">
                                <Image
                                    src={step.icon}
                                    alt={step.title}
                                    width={150}
                                    height={150}
                                    className="object-contain"
                                />
                            </div>
                            <h3 className="font-semibold text-lg mb-2 text-primary">
                                <span className="text-accent">{step.id}</span>. {step.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12">
                    <button className="bg-accent text-white px-6 py-3 rounded-lg shadow-md 
        hover:bg-accent-hover hover:shadow-lg transition">
                        Enroll Yourself Now
                    </button>
                </div>
            </div>
        </section>

    );
}
