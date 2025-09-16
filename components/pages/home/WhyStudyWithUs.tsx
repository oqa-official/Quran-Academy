"use client";
import { TextAnimate } from "@/components/magicui/text-animate";
import { motion } from "framer-motion";
import Image from "next/image";

const cards = [
  {
    iconSrc: "/assets/global/icon1.png",
    title: "Worldwide Recognized",
    description: "We offer convenient class timings for all regions around the world. We appreciate your efforts and manage our classes according to your regions and countries.",
  },
  {
    iconSrc: "/assets/global/icon2.png",
    title: "24/7 Service",
    description: "We have professional Quran tutors on the board and educate a vast range of students worldwide through the easiest and simplest Quran tutoring system.",
  },
  {
    iconSrc: "/assets/global/icon3.png",
    title: "Appraisal Certificate",
    description: "We also offer live Holy Quran classes for the students who want to learn Quran daily. We intend to make your Quranic skills more vulnerable and unconventional.",
  },
  {
    iconSrc: "/assets/global/icon4.png",
    title: "Easy Online Payments",
    description: "We respect our client base and proudly offer the 3 days free trial of Quran reading, learning, and tajweed to ensure you that you are at the right place to learn.",
  },
  {
    iconSrc: "/assets/global/icon5.png",
    title: "Individual Classes",
    description: "We offer convenient class timings for all regions around the world. We appreciate your efforts and manage our classes according to your regions and countries.",
  },
  {
    iconSrc: "/assets/global/icon6.png",
    title: "Evaluation Reports",
    description: "We have professional Quran tutors on the board and educate a vast range of students worldwide through the easiest and simplest Quran tutoring system.",
  },
  {
    iconSrc: "/assets/global/icon7.png",
    title: "Online Panel",
    description: "We also offer live Holy Quran classes for the students who want to learn Quran daily. We intend to make your Quranic skills more vulnerable and unconventional.",
  },
  {
    iconSrc: "/assets/global/icon8.png",
    title: "Alternative Teachers",
    description: "We respect our client base and proudly offer the 3 days free trial of Quran reading, learning, and tajweed to ensure you that you are at the right place to learn.",
  },
  {
    iconSrc: "/assets/global/icon9.png",
    title: "Multilingual Tutors",
    description: "We offer convenient class timings for all regions around the world. We appreciate your efforts and manage our classes according to your regions and countries.",
  },
];


export default function WhyStudyWithUs() {
  return (
   <div className="bg-white">
     <section className=" py-10 relative overflow-hidden container">
      {/* Decorative Lamp */}
     

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Top Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <img
              src="/assets/home/verse.png"
              alt="Quran verse"
              className="mx-auto mb-6 w-[80%]"
            />
          </motion.div>

          <TextAnimate animation="blurIn" by="word" duration={0.6} as="h2" className="text-2xl md:text-3xl -mt-3 font-bold mb-2 text-primary">
            Why Study with Us?
          </TextAnimate>

          <img src="/assets/home/arrow.png" alt="Quran verse" className="w-[200px] text-center mx-auto mb-2" />

          <p className="text-gray-600">
            Online Quran Academy is a subtle way to learn or revise the Holy
            Quran from the sketch to the tajweed theories. We dynamically offer
            various packages to learn the accurate Quran reading with proper
            Pronunciation. We also provide the Tajweed classes to sharpen your
            Quranic skills.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="p-6 border rounded-xl flex flex-col md:flex-row items-start space-x-4
                         transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer
                         bg-white shadow-sm"
            >
              <div className="flex-shrink-0">
                <Image
                  src={card.iconSrc}
                  alt={card.title}
                  width={60}
                  height={60}
                />
              </div>
              <div className="mt-4 md:mt-0">
                <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
   </div>
  );
}