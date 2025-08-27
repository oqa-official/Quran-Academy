"use client";
import { TextAnimate } from "@/components/magicui/text-animate";
import { motion } from "framer-motion";




import Hero from '@/components/pages/About-us/Hero'
import CareerForm from '@/components/pages/Careers/CareerForm'
import React from 'react'

function page() {
  return (
    <div>
      <Hero
        heading="Career"
        paragraph="Quran Academy provide a respectful and nurturing platform for passionate educators to share knowledge and inspire students worldwide."
        backgroundImage="/assets/home/hero4.png"
      />


      <div className="container">
        <div className="mt-5 flex flex-col justify-center items-center">
          <motion.img
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: false }}
            src="/assets/home/verse2.png"
            alt="Quran verse"
            className="mx-auto mb-6 max-h-[75px]"
          />


          <TextAnimate animation="blurIn" by="word" duration={0.6} as="h2" className="text-2xl md:text-3xl -mt-3 font-bold mb-2 text-primary">
            Become a teacher
          </TextAnimate>

          <img src="/assets/home/arrow.png" alt="Quran verse" className="w-[200px] text-center mx-auto mb-4" />
        </div>

        <div className="flex justify-center md:flex-row-reverse items-start my-12">
          <div className="w-[40%] hidden md:flex justify-start">
            <img
              src="/assets/career/quran.png"
              alt="Instructor teaching"
              className=" md:w-[80%] h-auto object-cover mx-auto"
            />
          </div>

          <div className="md:w-[60%] w-full">
            <CareerForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default page