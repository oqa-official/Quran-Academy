'use client'
import { motion } from 'framer-motion';
import React from 'react';
import Image from 'next/image';
import { TextAnimate } from '@/components/magicui/text-animate';

// Define types for feature items
interface FeatureItem {
    id: string;
    verseImage: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    image: string;
    reverseLayout?: boolean; // Optional: true if image is on the left
}

const featuresData: FeatureItem[] = [
    {
        id: 'interactive-ui',
        verseImage: 'خَيْرُکُم مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', // Placeholder for Arabic verse image
        title: 'Interactive UI',
        description: 'We underwent smooth online classes and made the Quran Learning easiest for all. We created an eco-friendly online safest atmosphere to make you comfortable while learning.',
        ctaText: 'Get Enrolled Now',
        ctaLink: '#',
        image: '/assets/about/laptop.png', // Placeholder for laptop image
        reverseLayout: false,
    },
    {
        id: 'enhanced-learning',
        verseImage: 'خَيْرُکُم مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', // Placeholder for Arabic verse image
        title: 'Enhanced Learning',
        description: 'Quran Acedemy dares to boost your learning intentions with its top-tier Quran tutors and impressive welcoming style. We upskill your hidden intelligence through our wise education system.',
        ctaText: 'Get Enrolled Now',
        ctaLink: '#',
        image: '/assets/about/laptop2.png', // Placeholder for laptop image
        reverseLayout: true, // This item will have the image on the left
    },
];

const Features: React.FC = () => {
    return (
        <section className="py-10 bg-white">
            <div className="container ">
                {/* Top Section: Verse Image, Heading, Arrow */}
                <div className="text-center mb-12">
                    {/* Main Arabic verse image */}
                    <motion.img
                     initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: false }}
                        src="/assets/about/verse.png"
                        alt="Main Quranic Verse"
                        className="mx-auto mb-4 max-h-[90px]"
                    />

                    <TextAnimate animation="blurIn" by="word" duration={0.6} as="h2" className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                        Quran Academy Feature
                    </TextAnimate>
                    {/* Decorative arrow/line image */}
                    <img
                        src="/assets/home/arrow.png"
                        alt="Decorative arrow"
                        className="w-[150px] mx-auto mb-8"
                    />
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Quran Academy polishes the learning skills for the individuals who love to intertwine with the Holy Quran learning tactics. We are a subtle way to educate you mannerly.
                    </p>
                </div>

                {/* Feature Rows */}
                <div className="space-y-4 flex justify-center flex-col items-center">
                    {featuresData.map((feature) => (
                        <div
                            key={feature.id}
                            className={`flex flex-col justify-between max-w-5xl items-center gap-8 ${feature.reverseLayout ? 'md:flex-row-reverse' : 'md:flex-row'
                                }`}
                        >
                            {/* Text Content Column */}
                            <div className="flex-1 md:w-[50%] basis-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                                <h3 className='text-accent text-lg'>
                                    {feature.verseImage}
                                </h3>
                                <h3 className="text-2xl font-bold text-gray-800">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                                <button className="bg-primary hover:bg-primary-hover text-white  py-3 px-6 rounded-md transition-colors duration-300">
                                    {feature.ctaText}
                                </button>
                            </div>

                            {/* Image Column */}
                            <div className="flex-1 md:w-[50%] basis-1/2 flex justify-start items-center">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full max-w-md h-auto object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
