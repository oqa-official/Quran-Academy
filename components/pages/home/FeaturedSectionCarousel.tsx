"use client";
import { TextAnimate } from "@/components/magicui/text-animate";
import { motion } from "framer-motion";
import { Check, Star, User } from "lucide-react";
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
    img: "/assets/home/course1.png",
  },
];

function CourseCard({
  title,
  price,
  reviews,
  rating,
  teacher,
  students,
  avatar,
  img,
}: any) {
  return (
    <div className="keen-slider__slide p-2 py-6">
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg cursor-pointer shadow-md shadow-gray-400 transition-all duration-300 hover:scale-[1.010]">
        {/* Top Image */}
        <div className="relative ">
          <img src={img} alt={title} className="w-full h-56 object-cover" />


            <div className="absolute right-1 bg-accent p-2 rounded-full bottom-1 flex items-baseline justify-center">
            <span className="text-sm self-start text-black group-hover:text-white transition-colors">
              $
            </span>
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors">
              {price}
            </h2>
           
          </div>

        </div>

        {/* Content */}
        <div className="p-3">
          {/* Rating */}
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex items-center justify-start text-yellow-500 text-sm mb-2">
              {[...Array(rating)].map((_, i) => (
                <span key={i}><Star className="fill-accent" size={15} /></span>
              ))}
              <span className="ml-2 text-gray-600">({reviews} Reviews)</span>

            </div>

          </div>


          {/* Title */}
          <h2
            className="text-lg font-bold text-gray-800 mb-3 text-center"
            dangerouslySetInnerHTML={{ __html: title }}
          />

        

          {/* Students + Price */}


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
                className="flex items-center text-gray-600 text-xs"
              >
                <Check className="w-4 h-4 mr-2 text-gray-500" />
                {item}
              </li>
            ))}
          </ul>

          {/* Teacher */}
          <div className="flex items-center justify-between space-x-2 mt-4 border-t pt-3">
            <div className="flex justify-start items-center gap-1">
              <img src={avatar} alt={teacher} className="w-8 h-8 rounded-full" />
              <span className="text-sm font-medium text-gray-700">
                {teacher}
              </span>
            </div>
            <div className="flex justify-center items-center">
              <User size={15} fill="gray" className="text-gray-500" />
              <span className="text-sm">{students}</span>
            </div>
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

export default function FeaturedSectionCarousel({
  heading = "Featured Courses",
  lamp,
}: FeaturedSectionCarouselProps) {
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
            className="md:w-[250px] w-[80px]"
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
      </div>
    </section>
  );
}
