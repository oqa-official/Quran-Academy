"use client";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/useCurrency";
import { Check } from "lucide-react";
import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";

interface Course {
    id: string;
    title: string;
    summary: string;
    basePrice: number;
}

const features = [
    "One-on-one live sessions",
    "Flexible scheduling",
    "Expert Quran tutors",
    "Weekly progress reports",
];

export default function PricingTabs({ courses }: { courses: Course[] }) {
    const { symbol, rate } = useCurrency();
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const activeCourse = courses[activeIndex];

    // Always 4 plans for each course
    const plans = [
        {
            label: "2 Days/Week",
            price: activeCourse.basePrice,
            src: "/assets/home/pricing1.png",
        },
        {
            label: "3 Days/Week",
            price: activeCourse.basePrice + 10,
            src: "/assets/home/pricing2.png",
        },
        {
            label: "4 Days/Week",
            price: activeCourse.basePrice + 20,
            src: "/assets/home/pricing3.png",
        },
        {
            label: "5 Days/Week",
            price: activeCourse.basePrice + 25,
            src: "/assets/home/pricing4.png",
        },
    ];

    // Keen slider
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: false,
        slides: {
            perView: 1.1,
            spacing: 15,
        },
        breakpoints: {
            "(min-width: 768px)": {
                slides: { perView: 2, spacing: 20 },
            },
            "(min-width: 1024px)": {
                slides: { perView: 4, spacing: 20 },
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
        <div className="px-6 py-16">


            {/* Course Title */}
            <div className="w-full flex-col justify-center items-center">
                <h2 className="text-3xl font-bold text-center mb-2">
                    Our Economical Pricing
                </h2>
                <p className="text-center text-gray-600 mb-8 max-w-[700px] mx-auto">{activeCourse.summary}</p>

                {courses.length > 2 && (
                    <div className="flex sm:flex-row flex-col gap-2 space-x-3 mb-8 justify-center">
                        {courses.map((course, i) => (
                            <button
                                key={course.id}
                                onClick={() => setActiveIndex(i)}
                                className={`px-4 py-2 rounded-lg  transition ${i === activeIndex
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                {course.title.split(" ").slice(0, 2).join(" ")}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Pricing Cards Carousel */}
            <div ref={sliderRef} className="keen-slider">
                {plans.map((plan, idx) => (
                    <div key={idx} className="keen-slider__slide p-2 py-4">
                        <div className="bg-transparent relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300">
                            {/* Top image (hover swap) */}
                            <div className="w-full">
                                <img
                                    src="/assets/home/card_top.png"
                                    alt="card top"
                                    className="w-full h-full group-hover:hidden group-focus:hidden group-active:hidden"
                                />
                                <img
                                    src="/assets/home/hover_card_top.png"
                                    alt="card top hover"
                                    className="w-full h-full hidden group-hover:block group-focus:block group-active:block"
                                />
                            </div>

                            {/* Card content */}
                            <div className="p-3 bg-white group-hover:bg-primary group-focus:bg-primary group-active:bg-primary -mt-1 shadow-2xl shadow-black">
                                <div className="text-primary bg-[#bababa33] scale-x-110 py-2 flex justify-center group-hover:text-white">
                                    <span>{plan.label}</span>
                                </div>

                                <img
                                    src={plan.src}
                                    alt="Quran Learning"
                                    className="text-center absolute w-[30%] top-[12%] left-[50%] transform -translate-x-[50%] mx-auto"
                                />

                                {/* Price */}
                                <div className="text-center mb-10 mt-5">
                                    <div className="flex items-baseline justify-center space-x-1">
                                        <h5 className="text-xl self-start text-gray-600 group-hover:text-white transition-colors">
                                            {symbol}
                                        </h5>
                                        <h2 className="text-4xl font-bold text-gray-800 group-hover:text-white transition-colors"> 
                                            {(plan.price * rate).toFixed(2)}
                                        </h2>
                                        <span className="text-sm text-gray-600 group-hover:text-white transition-colors">
                                            /month
                                        </span>
                                    </div>
                                    <hr className="w-full h-[2px] bg-black opacity-25 mt-3" />
                                </div>

                                {/* Features */}
                                <ul className="space-y-2 mt-4">
                                    {features.map((item, fIdx) => (
                                        <li
                                            key={fIdx}
                                            className="flex items-start text-gray-600 group-hover:text-white transition-colors text-sm"
                                        >
                                            <Check className="w-4 h-4 mr-2 mt-1 text-gray-600 group-hover:text-white transition-colors" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <div className="flex justify-center items-center space-x-2 mt-4 pt-2">
                                    <Link href={`/courses/${activeCourse.id}`}>
                                        <Button
                                            className="bg-transparent text-primary border-primary group-hover:text-white group-hover:border-white hover:bg-transparent rounded-[2px] mb-10"
                                            size={"lg"}
                                            variant={"outline"}
                                        >
                                            Signup Today
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots for mobile */}
            {loaded && instanceRef.current && (
                <div className="flex justify-center gap-2 mt-4 md:hidden">
                    {[
                        ...Array(instanceRef.current.track.details.slides.length).keys(),
                    ].map((idx) => (
                        <button
                            key={idx}
                            onClick={() => instanceRef.current?.moveToIdx(idx)}
                            className={`w-2 h-2 rounded-full ${currentSlide === idx ? "bg-primary" : "bg-gray-300"
                                }`}
                        ></button>
                    ))}
                </div>
            )}
        </div>
    );
}
