"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import CourseCard from "../home/CourseCard";
import Link from "next/link";

// ------------------ DATA ------------------
interface Course {
  title: string;
  price: number;
  reviews: number;
  rating: number;
  teacher: string;
  students: number;
  avatar: string;
  img: string;
}

interface PlanContent {
  heading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  detailsText: string;
  detailsLink: string;
}

interface PlanItem {
  id: string;
  title: string;
  image: string; // icon
  content_image: string; // old img (replaced by courseCard)
  content: PlanContent;
  course: Course;
}

const plans: PlanItem[] = [
  {
    id: "reading",
    title: "Quran Reading",
    image: "/assets/home/pricing2.png",
    content_image: "/assets/courses/plan2.png",
    content: {
      heading: "Learn Quran Reading",
      description:
        "This course is designed for those who want to start their journey of reading the Holy Quran from scratch. We cover all the basics of the Arabic alphabet, pronunciation, and reading with proper phonetics to ensure a solid foundation.",
      ctaText: "Start Reading",
      ctaLink: "/courses/1",
      detailsText: "More Details →",
      detailsLink: "#",
    },
    course: {
      title: "Learn Quranic Studies for Beginner (Level-I)",
      price: 20,
      reviews: 3,
      rating: 5,
      teacher: "Hafiz Muhammad Usman",
      students: 58,
      avatar: "/assets/home/teacher1.png",
      img: "/assets/home/course_1.png",
    },
  },
  {
    id: "recitation",
    title: "Quran Recitation",
    image: "/assets/home/pricing3.png",
    content_image: "/assets/courses/plan1.png",
    content: {
      heading: "Reciting the Quran",
      description:
        "Our recitation program helps students to commit the entire Holy Quran to memory. Our qualified tutors provide personalized guidance, techniques, and revision sessions to ensure the student achieves their goal of becoming a Hafiz.",
      ctaText: "Memorize Now",
      ctaLink: "/courses/1",
      detailsText: "More Details →",
      detailsLink: "#",
    },
    course: {
      title: "Learn Recitation of Quran (Level-II)",
      price: 25,
      reviews: 5,
      rating: 5,
      teacher: "Abdur Rehman",
      students: 72,
      avatar: "/assets/home/teacher2.png",
      img: "/assets/home/course_2.png",
    },
  },
  {
    id: "tajweed",
    title: "Quran Tajweed",
    image: "/assets/home/pricing1.png",
    content_image: "/assets/courses/plan3.png",
    content: {
      heading: "Learn Tajweed",
      description:
        "Quran Online Master offers the Quran Tajweed learning through its professional tajweed teachers. If you know how to read the Quran and intend to augment your tajweed skills, you are at the right place as we would drive your interest towards the expertise in the Holy Quran.",
      ctaText: "Get Enrolled Now",
      ctaLink: "/courses/1",
      detailsText: "More Details →",
      detailsLink: "#",
    },
    course: {
      title: "Learn Quran with Tajweed (Level-III)",
      price: 35,
      reviews: 1,
      rating: 5,
      teacher: "Muhammad Junaid",
      students: 50,
      avatar: "/assets/home/teacher3.png",
      img: "/assets/home/course1.png",
    },
  },
];

// ------------------ COMPONENTS ------------------
interface PlanTabProps {
  plan: PlanItem;
  isActive: boolean;
  onClick: (id: string) => void;
}

const PlanTab: React.FC<PlanTabProps> = ({ plan, isActive, onClick }) => (
  <div
    className={`
      relative z-[2] flex flex-col items-center justify-center space-y-1 md:px-6 p-2 md:p-4 rounded-md shadow-lg
      transform cursor-pointer
      ${isActive ? "bg-white" : "bg-gray-800 hover:bg-gray-700"}
    `}
    onClick={() => onClick(plan.id)}
  >
    <img
      src={plan.image}
      alt={plan.title}
      className={`
        md:w-16 md:h-16 w-12 h-12 object-cover
        ${isActive ? "filter-none" : "filter grayscale"}
        transition-filter duration-500
      `}
    />
    <p
      className={`text-sm md:text-lg font-medium md:font-semibold ${
        isActive ? "text-primary" : "text-gray-300"
      }`}
    >
      {plan.title}
    </p>

    <div
      className={`absolute ${!isActive && "hidden"} -bottom-3 md:-bottom-5 -z-[1] left-1/2 transform -translate-x-1/2  md:w-10 md:h-10 w-6 h-6 border-b-1 border-gray-200 rotate-45 bg-white border-r-2`}
    ></div>
  </div>
);

interface PlanContentProps {
  content: PlanContent & { image: string; secondary_image: string };
  course: Course;
}

const PlanContent: React.FC<PlanContentProps> = ({ content, course }) => (
  <div className="flex flex-col md:flex-row justify-center items-center gap-10">
    {/* Left side */}
    <div className="flex-1 md:max-w-[50%] flex flex-col items-center md:items-start text-center md:text-left">
      <img src={content.secondary_image} alt={content.heading} className="w-16" />
      <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-2">{content.heading}</h2>
      <img
        src="/assets/home/arrow.png"
        alt="Quran verse"
        className="w-[120px] text-start -ms-2"
      />
      <p className="text-gray-600 max-w-[500px] mb-6">{content.description}</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={content.ctaLink}>
        <button className="bg-primary hover:bg-primary-hover text-white py-3 px-6 rounded-md transition-colors duration-300">
          {content.ctaText}
        </button>
        </Link>
        <a
          href={content.detailsLink}
          className="bg-accent hover:bg-accent-hover text-black font-medium py-3 px-6 rounded-md transition-colors duration-300"
        >
          {content.detailsText}
        </a>
      </div>
    </div>

    {/* Right side → CourseCard instead of static image */}
    <div className="flex-1 md:max-w-[40%] hidden md:flex">
      <CourseCard {...course} />
    </div>
  </div>
);

// ------------------ MAIN ------------------
const OurPlans: React.FC = () => {
  const [activeTab, setActiveTab] = useState(plans[0].id);
  const activePlan = plans.find((plan) => plan.id === activeTab);

  return (
    <section className="py-20">
      <div className="bg-primary relative z-[10]">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage: "url('/assets/home/missionbg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Header */}
        <div className="pt-6 w-full container text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <img
                src="/assets/home/verse2.png"
                alt="Quran verse"
                className="mx-auto w-[80%] mb-6"
              />
            </motion.div>
            <h2 className="text-3xl font-bold mb-2 text-white">
              Our Plan for Individual Courses
            </h2>
            <p className="text-gray-300">
              We undergo the versatile modules of the Quran's tajweed learning to make you perfect anyhow. Our professional learning programs divided the learning Tajweed into three several stages to make you comfortable while learning Tajweed.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-row justify-center gap-6 mb-12">
            {plans.map((plan) => (
              <PlanTab
                key={plan.id}
                plan={plan}
                isActive={plan.id === activeTab}
                onClick={setActiveTab}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-md:pt-10">
        {activePlan && (
          <PlanContent
            content={{
              ...activePlan.content,
              image: activePlan.content_image,
              secondary_image: activePlan.image,
            }}
            course={activePlan.course}
          />
        )}
      </div>
    </section>
  );
};

export default OurPlans;
