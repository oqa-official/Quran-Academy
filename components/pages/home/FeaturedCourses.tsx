"use client";
import CourseCard from "./CourseCard";
import { TextAnimate } from "@/components/magicui/text-animate";
import { motion } from "framer-motion";


const courses = [
  {
    title: "Learn Quranic Studies for Beginner (Level-I)",
    price: 20,
    reviews: 3,
    rating: 5,
    teacher: "Hafiz Muhammad Usman",
    students: 58,
    avatar: "/assets/home/teacher1.png",
    img: "/assets/home/course1.png",
  },
  {
    title: "Learn Recitation of Quran (Level-II)",
    price: 25,
    reviews: 5,
    rating: 5,
    teacher: "Abdur Rehman",
    students: 72,
    avatar: "/assets/home/teacher2.png",
    img: "/assets/home/course2.png",
  },
  {
    title: "Learn Quran with Tajweed (Level-III)",
    price: 35,
    reviews: 1,
    rating: 5,
    teacher: "Muhammad Junaid",
    students: 50,
    avatar: "/assets/home/teacher3.png",
    img: "/assets/home/course3.png",
  },
];

export default function FeaturedCourses() {
  return (
    <section className="py-16 relative bg-transparent">

      {/* Lamp */}
      <motion.div className="absolute top-0 left-0" initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: false }}>
        <img src="/assets/home/lamp2.png" alt="lamp" className="md:w-[250px] w-[80px]" />
      </motion.div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Quran Verse Image */}
          <motion.div initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}>
            <img
              src="/assets/home/verse4.png"
              alt="Quran verse"
              className="mx-auto mb-6"
            />
          </motion.div>

          {/* Heading */}

          <TextAnimate animation="blurIn" by="word" duration={0.6} as="h2" className="text-2xl md:text-3xl -mt-3 font-bold mb-2 text-primary">
           Featured Courses
          </TextAnimate>


          {/* Decorative Line / Arrow */}
          <img
            src="/assets/home/arrow.png"
            alt="decorative arrow"
            className="w-[200px] text-center mx-auto mb-2"
          />

          {/* Subheading Paragraph */}
          <p className="text-gray-600">
            Explore our range of Quran courses tailored for all ages and levels.
            Whether you’re beginning your journey or seeking to perfect your Tajweed,
            our experienced teachers are here to guide you step by step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-32 gap-10 place-items-center">
          {courses.map((course, idx) => (
            <CourseCard key={idx} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
}
