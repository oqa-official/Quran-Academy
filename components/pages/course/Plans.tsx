'use client'
import React, { useState } from 'react';
import { motion } from "framer-motion";


// Define the data for each tab, including the title, image, and content
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
    image: string;
    content: PlanContent;
    content_image: string;
}

const plans: PlanItem[] = [
    {
        id: 'tajweed',
        title: 'Tajweed - 3 Modules',
        image: '/assets/home/pricing1.png',
        content_image: '/assets/courses/plan3.png',
        content: {
            heading: 'Learn Tajweed',
            description: 'Quran Online Master offers the Quran Tajweed learning through its professional tajweed teachers. If you know how to read the Quran and intend to augment your tajweed skills, you are at the right place as we would drive your interest towards the expertise in the Holy Quran.',
            ctaText: 'Get Enrolled Now',
            ctaLink: '#',
            detailsText: 'More Details →',
            detailsLink: '#'
        },
    },
    {
        id: 'reading',
        title: 'Quran Reading',
        image: '/assets/home/pricing2.png',
        content_image: '/assets/courses/plan2.png',
        content: {
            heading: 'Learn Quran Reading',
            description: 'This course is designed for those who want to start their journey of reading the Holy Quran from scratch. We cover all the basics of the Arabic alphabet, pronunciation, and reading with proper phonetics to ensure a solid foundation.',
            ctaText: 'Start Reading',
            ctaLink: '#',
            detailsText: 'More Details →',
            detailsLink: '#'
        },
    },
    {
        id: 'memorization',
        title: 'Quran Memorization',
        image: '/assets/home/pricing3.png',
        content_image: '/assets/courses/plan1.png',
        content: {
            heading: 'Memorize the Quran',
            description: 'Our memorization program helps students to commit the entire Holy Quran to memory. Our qualified tutors provide personalized guidance, techniques, and revision sessions to ensure the student achieves their goal of becoming a Hafiz.',
            ctaText: 'Memorize Now',
            ctaLink: '#',
            detailsText: 'More Details →',
            detailsLink: '#'
        },
    },
];

// Reusable Tab component with types
interface PlanTabProps {
    plan: PlanItem;
    isActive: boolean;
    onClick: (id: string) => void;
}

const PlanTab: React.FC<PlanTabProps> = ({ plan, isActive, onClick }) => (
    <div
        className={`
      flex flex-col items-center justify-center space-y-1 md:p-6 p-2 rounded-md shadow-lg
      transition-all duration-300 transform cursor-pointer
      ${isActive ? 'bg-white' : 'bg-gray-800 hover:bg-gray-700'}
    `}
        onClick={() => onClick(plan.id)}
    >
        <img
            src={plan.image}
            alt={plan.title}
            className={`
        md:w-16 md:h-16 w-12 h-12 object-cover
        ${isActive ? 'filter-none' : 'filter grayscale'}
        transition-filter duration-500
      `}
        />
        <p className={`text-sm md:text-lg font-medium md:font-semibold ${isActive ? 'text-primary' : 'text-gray-300'}`}>
            {plan.title}
        </p>
    </div>
);

// Component to display the dynamic content based on the active tab with types
interface PlanContentProps {
    content: PlanContent & { image: string } & {secondary_image :string};
}

const PlanContent: React.FC<PlanContentProps> = ({ content }) => (
    <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 md:max-w-[50%] flex flex-col items-center md:items-start text-center md:text-left">
            <img src={content.secondary_image} alt={content.heading} className='w-16' />
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-2">{content.heading}</h2>
            <img src="/assets/home/arrow.png" alt="Quran verse" className="w-[120px] text-start -ms-2" />
            <p className="text-gray-600 mb-6">{content.description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded-md transition-colors duration-300">
                    {content.ctaText}
                </button>
                <a href={content.detailsLink} className="text-primary font-medium py-3 px-6 transition-colors duration-300 hover:text-blue-800">
                    {content.detailsText}
                </a>
            </div>
        </div>
        <div className="flex-1 md:max-w-[50%] rounded-lg overflow-hidden  hidden md:flex">
            <img
                src={content.image}
                alt={content.heading}
                className="w-full max-w-[350px] mx-auto py-10 h-auto object-cover transition-transform duration-500 hover:scale-105"
            />
        </div>
    </div>
);

// Main component that orchestrates the entire section
const OurPlans: React.FC = () => {
    const [activeTab, setActiveTab] = useState(plans[0].id);

    const activePlan = plans.find(plan => plan.id === activeTab);

    return (
        <section className=" py-20">
            <div className="bg-primary relative z-[100]">

                <div className='absolute inset-0 -z-10 opacity-30'
                    style={{
                        backgroundImage: "url('/assets/home/missionbg.png')", // Replace with your background image
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >

                </div>
                {/* Top section with title and description */}
                <div className='py-3 pt-6 w-full container text-center'>
                    <div className="max-w-3xl mx-auto mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            viewport={{ once: false }} // run only first time in view
                        >
                            <img
                                src="/assets/home/verse2.png"
                                alt="Quran verse"
                                className="mx-auto w-[80%] mb-6"
                            />
                        </motion.div>
                        <h2 className="text-3xl font-bold mb-2 text-white">Our Plan for Individual Courses</h2>
                        <p className="text-gray-300">
                            We undergo the versatile modules of the Quran's tajweed learning to make you perfect anyhow. Our professional learning programs divided the learning Tajweed into three several stages to make you comfortable while learning Tajweed.
                        </p>
                    </div>

                    {/* Tab-like navigation */}
                    <div className="flex flex-row sm:flex-row justify-center gap-6 mb-12">
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


            <div className='container max-md:pt-10'>
                {/* Dynamic content section */}
                {activePlan && (
                    <PlanContent content={{ ...activePlan.content, image: activePlan.content_image, secondary_image : activePlan.image}} />
                )}
            </div>
        </section>
    );
};

export default OurPlans;
