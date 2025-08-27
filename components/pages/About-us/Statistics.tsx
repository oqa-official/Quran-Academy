import { NumberTicker } from '@/components/magicui/number-ticker';
import React from 'react';

// Define the data for the statistics
const statistics = [
    { value: 300, post: "+", label: 'Registered Students' },
    { value: 30, post: "+", label: 'Quran Tutors Available' },
    { value: 3000, post: "+", label: 'Sessions Completed' },
    { value: 95, post: "%", label: 'Satisfied Customers' },
];

export const StatisticsSection: React.FC = () => {
    return (
        <section className="relative w-full py-16 text-white overflow-hidden">
            {/* Background image and overlay */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/assets/home/hero1.png")' , backgroundPosition: "left center"}}>
                <div className="absolute inset-0 bg-black opacity-70"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-12">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                    {statistics.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center">
                            <div className='flex items-center'>
                                <h2>
                                    <NumberTicker
                                        value={stat.value} className='text-2xl md:text-4xl lg:text-6xl font-medium text-accent mb-2' />
                                </h2>
                                <span className='text-2xl md:text-4xl lg:text-6xl text-accent mb-2'>{stat.post}</span>
                            </div>
                            <p className="text-sm md:text-lg font-normal text-gray-300">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
