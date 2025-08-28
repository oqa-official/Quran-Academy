"use client";
import { TextAnimate } from "@/components/magicui/text-animate";
import { motion } from "framer-motion";
import { Check, Star, User } from "lucide-react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";
import CourseCard from "./CourseCard";

const courses = [
  {
    title: "Learn Quranic Studies for Beginner (Level-I)",
    price: 20,
    reviews: 3,
    rating: 5,
    teacher: "Hafiz Muhammad Usman",
    students: 58,
    avatar: "/assets/home/teacher1.png",
    img: "/assets/home/course_1.png",
  },
  {
    title: "Learn Recitation of Quran (Level-II)",
    price: 25,
    reviews: 5,
    rating: 5,
    teacher: "Abdur Rehman",
    students: 72,
    avatar: "/assets/home/teacher2.png",
    img: "/assets/home/course_2.png",
  },
  {
    title: "Learn Quran with Tajweed (Level-III)",
    price: 35,
    reviews: 1,
    rating: 5,
    teacher: "Muhammad Junaid",
    students: 50,
    avatar: "/assets/home/teacher3.png",
    img: "/assets/home/course1.png",
  },
];



type FeaturedSectionCarouselProps = {
  heading?: string;
  lamp?: boolean;
};

export default function FeaturedSectionCarousel({
  heading = "Featured Courses",
  lamp,
}: FeaturedSectionCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: {
      perView: 1.1,
      spacing: 15,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 3, spacing: 20 },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    <section className="py-16 relative bg-transparent">
      {/* Lamp */}
      {lamp && (
        <motion.div
          className="absolute top-0 left-0"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false }}
        >
          <img
            src="/assets/home/lamp2.png"
            alt="lamp"
            className="md:w-[200px] w-[80px]"
          />
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto px-6">
        {/* Heading Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <img
              src="/assets/home/verse4.png"
              alt="Quran verse"
              className="mx-auto mb-6"
            />
          </motion.div>

          <TextAnimate
            animation="blurIn"
            by="word"
            duration={0.6}
            as="h2"
            className="text-2xl md:text-3xl -mt-3 font-bold mb-2 text-primary"
          >
            {heading}
          </TextAnimate>

          <img
            src="/assets/home/arrow.png"
            alt="decorative arrow"
            className="w-[200px] text-center mx-auto mb-2"
          />

          <p className="text-gray-600">
            Explore our range of Quran courses tailored for all ages and levels.
            Whether you’re beginning your journey or seeking to perfect your
            Tajweed, our experienced teachers are here to guide you step by
            step.
          </p>
        </div>

        {/* Carousel */}
        <div ref={sliderRef} className="keen-slider">
          {courses.map((course, idx) => (
            <CourseCard key={idx} {...course} />
          ))}
        </div>

        {/* Dots for Mobile */}
        {loaded && instanceRef.current && (
          <div className="flex justify-center md:hidden">
            {[
              ...Array(instanceRef.current.track.details.slides.length).keys(),
            ].map((idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-2 h-2 mx-1 rounded-full ${
                  currentSlide === idx ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
