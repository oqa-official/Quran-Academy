"use client";
import { TextAnimate } from "@/components/magicui/text-animate";
import { motion } from "framer-motion";


export default function WhyChooseUs() {
    return (
        <section className="py-16 bg-white relative overflow-hidden">
            {/* Decorative Lamp */}
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: false }}
                className="absolute md:-top-2 -top-4 md:right-10 right-2">
                <img src="/assets/home/lamp.png" alt="lamp" className=" max-w-[70px] md:max-w-[200px]" />
            </motion.div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                {/* Top Section */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true }} // run only first time in view
                    >
                        <img
                            src="/assets/home/verse.png"
                            alt="Quran verse"
                            className="mx-auto mb-6"
                        />
                    </motion.div>



                    <TextAnimate animation="blurIn" by="word" duration={0.6} as="h2" className="text-2xl md:text-3xl -mt-3 font-bold mb-2 text-primary">
                        Why Choose Quran Academy?
                    </TextAnimate>

                    {/* </h2> */}
                    <img src="/assets/home/arrow.png" alt="Quran verse" className="w-[200px] text-center mx-auto mb-2" />

                    <p className="text-gray-600">
                        Quran Academy is a subtle way to learn or revise the Holy
                        Quran from the sketch to the tajweed theories. We dynamically offer
                        various packages to learn the accurate Quran reading with proper
                        Pronunciation. We also provide the Tajweed classes to sharpen your
                        Quranic skills.
                    </p>
                </div>

                {/* Content Grid + Image */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-10">
                    {/* Left Grid */}
                    <div className="md:max-w-[50%] grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Card 1 */}
                        <div className="p-6 shadow-md rounded-xl bg-white border 
                                        transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                            <h3 className="font-semibold text-lg mb-2">Progress You Can Track</h3>
                            <p className="text-gray-600 text-sm">
                                Parents receive regular updates and progress reports. From tajweed accuracy to memorization milestones, you’ll always know how far you or your child has come.
                            </p>
                            <a
                                href="#pricing"
                                className="text-accent text-sm font-medium mt-2 inline-block"
                            >
                                Learn More →
                            </a>
                        </div>

                        {/* Card 2 */}
                        <div className="p-6 shadow-md rounded-xl bg-white border 
                                        transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                            <h3 className="font-semibold text-lg mb-2">Our Proficiency</h3>
                            <p className="text-gray-600 text-sm">
                                Completing 7+ years of Quran teaching makes us proud to say that
                                we have always given our learners honesty, reliability, and
                                brilliance.
                            </p>
                            <a
                                href="#pricing"
                                className="text-accent text-sm font-medium mt-2 inline-block"
                            >
                                Learn More →
                            </a>
                        </div>

                        {/* Card 3 */}
                        <div className="p-6 shadow-md rounded-xl bg-white border md:col-span-2 
                                        transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                            <h3 className="font-semibold text-lg mb-2">
                                Live Holy Quran Classes
                            </h3>
                            <p className="text-gray-600 text-sm">
                                We offer live Holy Quran classes for students who want to learn
                                daily. Our goal is to make your Quranic skills stronger,
                                reliable, and well-pronounced.
                            </p>
                            <a
                                href="#pricing"
                                className="text-accent text-sm font-medium mt-2 inline-block"
                            >
                                Learn More →
                            </a>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="md:max-w-[50%]  justify-center overflow-hidden rounded-md hidden md:flex">
                        <img
                            src="/assets/home/side.png"
                            alt="Why choose us"
                            className="rounded-xl  max-w-sm w-full transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}