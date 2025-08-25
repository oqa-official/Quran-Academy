"use client";
import { TextAnimate } from "@/components/magicui/text-animate";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

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
    img: "/assets/home/course_3.png",
  },
];

function CourseCard({ title, price, reviews, rating, teacher, students, avatar }: any) {
  return (
    <div className="keen-slider__slide p-2 py-4">
      <div className="bg-transparent relative rounded-lg overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300">
        {/* Top image (hover swap) */}
        <div className="w-full">
          <img
            src="/assets/home/card_top.png"
            alt="card top"
            className="w-full h-full group-hover:hidden"
          />
          <img
            src="/assets/home/hover_card_top.png"
            alt="card top hover"
            className="w-full h-full hidden group-hover:block"
          />
        </div>

        {/* Card content */}
        <div className="p-3 bg-white group-hover:bg-primary -mt-1 shadow-2xl shadow-black">
          <div className="text-white bg-primary scale-x-110 py-2 flex justify-center group-hover:bg-white group-hover:text-primary">
            {[...Array(rating)].map((_, i) => (
              <span key={i}>⭐</span>
            ))}
            <span>({reviews}) Reviews</span>
          </div>

           <img
            src={'/assets/home/quran.png'}
            alt="Quran Learning"
            className="text-center absolute w-[30%] justify-center top-[50%]  left-[50%] transform -translate-x-[50%] mx-auto -mt-50"
          />

          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center group-hover:text-white mt-10">
            {title}
          </h2>

          {/* Price + Students */}
          <div className="text-center mb-4">
            <p className="text-xs text-gray-500 group-hover:text-white mb-2">
              {students} students
            </p>
            <div className="flex items-baseline justify-center space-x-1">
              <span className="text-xl text-gray-600 group-hover:text-white transition-colors">
                $
              </span>
              <span className="text-3xl font-bold text-gray-800 group-hover:text-white transition-colors">
                {price}
              </span>
              <span className="text-sm text-gray-600 group-hover:text-white transition-colors">
                /month
              </span>
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-2 mt-4">
            {[
              "Interactive Lessons",
              "Step-by-step Guidance",
              "Practical Assignments",
              "Certificate upon Completion",
            ].map((item, idx) => (
              <li
                key={idx}
                className="flex items-center text-gray-600 group-hover:text-white transition-colors text-sm"
              >
                <Check className="w-4 h-4 mr-2 text-gray-600 group-hover:text-white transition-colors" />
                {item}
              </li>
            ))}
          </ul>

          {/* Teacher avatar */}
          <div className="flex justify-start items-center space-x-2 mt-4 border-t pt-2 border-gray-200">
            <img src={avatar} alt={teacher} className="w-8 h-8 rounded-full" />
            <span className="text-sm text-gray-700 group-hover:text-white transition-colors">
              {teacher}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

type FeaturedSectionCarouselProps = {
  heading?: string;
  lamp?: boolean;
};

export default function FeaturedSectionCarousel({ heading = "Featured Courses", lamp}: FeaturedSectionCarouselProps) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
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
  });

  return (
    <section className={`py-16 relative bg-transparent`}>

        {/* Lamp */}
        {lamp && 
      <motion.div
      className="absolute top-0 left-0"
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: false }}
      >
        <img src="/assets/home/lamp2.png" alt="lamp" className="md:w-[250px] w-[80px]" />
      </motion.div>
      }



      <div className="max-w-6xl mx-auto px-6">
         <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Verse image */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <img src="/assets/home/verse4.png" alt="Quran verse" className="mx-auto mb-6" />
          </motion.div>

          {/* Heading */}
          <TextAnimate
            animation="blurIn"
            by="word"
            duration={0.6}
            as="h2"
            className="text-2xl md:text-3xl -mt-3 font-bold mb-2 text-primary"
          >
            {heading}
          </TextAnimate>

          {/* Arrow */}
          <img src="/assets/home/arrow.png" alt="decorative arrow" className="w-[200px] text-center mx-auto mb-2" />

          {/* Paragraph */}
          <p className="text-gray-600">
            Explore our range of Quran courses tailored for all ages and levels. Whether you’re beginning your journey
            or seeking to perfect your Tajweed, our experienced teachers are here to guide you step by step.
          </p>
        </div>
       

        {/* Carousel */}
        <div ref={sliderRef} className="keen-slider">
          {courses.map((course, idx) => (
            <CourseCard key={idx} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
}
