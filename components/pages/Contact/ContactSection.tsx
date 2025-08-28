'use client'
import React from 'react';
import { motion } from "framer-motion";
import { TextAnimate } from '@/components/magicui/text-animate';
import { Facebook, Instagram, LocateIcon, MapPin, Phone, Twitter } from 'lucide-react';


const ContactSection: React.FC = () => {
    return (
        <section className="py-10 container">
            <div className=" text-center">
                {/* Heading and Subheading */}

                <motion.img
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: false }}
                    src="/assets/home/verse2.png"
                    alt="Quran verse"
                    className="mx-auto mb-6 max-h-[80px]"
                />


                <TextAnimate animation="blurIn" by="word" duration={0.6} as="h2" className="text-2xl md:text-3xl -mt-3 font-bold mb-2 text-primary">
                    Get in Touch With Us
                </TextAnimate>

                <img src="/assets/home/arrow.png" alt="Quran verse" className="w-[200px] text-center mx-auto mb-4" />


               
                <p className="text-gray-600 max-w-4xl mx-auto mb-12">
                    We are listening to you 24/7, so you can quickly contact us on our landline, email, or visit our site, fill the form,
                    register yourself, and join us to read the Holy Quran with the professional educational protocol.
                </p>

                <div className="flex flex-col md:flex-row items-start justify-between gap-12">
                    {/* Left Column: Form */}
                    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start space-y-4 bg-white p-5 py-7 rounded-lg md:shadow-2xl">
                        <form className="w-full max-w-lg space-y-6 text-left">
                            {/* Full Name and Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2 border-b-2 border-gray-300 py-2">
                                    {/* Replaced icon with SVG */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Please Enter Your Name"
                                        className="w-full focus:outline-none placeholder-gray-500 text-gray-800"
                                    />
                                </div>
                                <div className="flex items-center space-x-2 border-b-2 border-gray-300 py-2">
                                    {/* Replaced icon with SVG */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <input
                                        type="email"
                                        placeholder="Please Enter Your Email"
                                        className="w-full focus:outline-none placeholder-gray-500 text-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="flex items-center space-x-2 border-b-2 border-gray-300 py-2">
                                {/* Replaced icon with SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.135a11.537 11.537 0 007.519 7.519l1.135-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <input
                                    type="tel"
                                    placeholder="0301 2345678"
                                    className="w-full focus:outline-none placeholder-gray-500 text-gray-800"
                                />
                            </div>

                            {/* Message */}
                            <div className="flex items-start space-x-2 border-b-2 border-gray-300 py-2">
                                <textarea
                                    rows={4}
                                    placeholder="Enter Your Message"
                                    className="w-full focus:outline-none placeholder-gray-500 text-gray-800 resize-none"
                                ></textarea>
                            </div>

                            {/* "I'm not a robot" checkbox - Not a reCAPTCHA */}
                            <div className="flex items-center">
                                <input type="checkbox" id="robot-check" className="mr-2 accent-primary" />
                                <label htmlFor="robot-check" className="text-gray-600">I'm not a robot</label>
                            </div>

                            <button
                                type="submit"
                                className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-md transition-colors duration-300"
                            >
                                SIGN UP TODAY
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Information & Socials */}
                    <div className="w-full md:w-1/2 text-left space-y-6">
                        <h3 className="text-lg md:text-xl font-bold text-primary">
                            Verse By Verse Learn Quran With US
                        </h3>
                        <p className="text-gray-600">
                            Count on us to learn the depth of the core factors of learning the Quran as we are the professional Quran
                            tutors around to make your master in QURAN.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                {/* Replaced icon with SVG */}
                                <MapPin size={18}/>
                                <span>Mailing Address: Holden House, 57 Rathbone Place, London</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                 <MapPin size={18}/>
                                <span>Mailing Address: RevoluSys Inc 8 the green site A, Dover, Delaware, 19901</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                  <Phone size={18}/>
                                <span>USA: +1 (646) 719-0725 UK: +44 2071 931528</span>
                            </div>
                            
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex space-x-4 text-2xl text-gray-600">
                            {/* Replaced icon with SVG */}
                            <a href="#" aria-label="Facebook" className="hover:text-primary transition-colors duration-300">
                               <Facebook className='text-primary' />
                            </a>
                            {/* Replaced icon with SVG */}
                            <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors duration-300">
                               <Instagram className='text-primary' />
                            </a>
                            {/* Replaced icon with SVG */}
                            <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors duration-300">
                               <Twitter className='text-primary'/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
