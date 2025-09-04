"use client";
import { motion } from "framer-motion";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Check } from "lucide-react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

function PricingCard({ src, plan, courseId }: any) {
    return (
        <div className="keen-slider__slide p-2 py-4">
            <div className="bg-transparent relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300">
                {/* Top image */}
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
                    <div className="text-primary bg-[#bababa33] scale-x-110 py-2 flex justify-center group-hover:text-white">
                        <span>{plan.label}</span>
                    </div>

                    <img
                        src={src}
                        alt="Quran Learning"
                        className="absolute w-[30%] top-[15%] left-[50%] transform -translate-x-[50%]"
                    />

                    {/* Price */}
                    <div className="text-center mb-10 mt-5">
                        <div className="flex items-baseline justify-center space-x-1">
                            <span className="text-xl text-gray-600 group-hover:text-white">
                                $
                            </span>
                            <h2 className="text-6xl font-bold text-gray-800 group-hover:text-white">
                                {plan.price}
                            </h2>
                            <span className="text-sm text-gray-600 group-hover:text-white">
                                /month
                            </span>
                        </div>
                        <hr className="w-full h-[2px] bg-black opacity-25 mt-3" />
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 mt-4">
                        {["30 min lessons", "24/7 Support", "Interactive Lessons", "Practical Assesment"].map((item, idx) => (
                            <li
                                key={idx}
                                className="flex items-start text-gray-600 group-hover:text-white text-sm"
                            >
                                <Check className="w-4 h-4 mr-2 mt-1 group-hover:text-white" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <div className="flex justify-center mt-4 pt-2">
                        <Link href={`/courses/${courseId}`}>
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
    );
}

export default function Pricing_Section_Dynamic({
    heading = "Our Economical Pricing",
    courses,
    loading,
}: {
    heading?: string;
    courses: any[];
    loading?: boolean;
}) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        mode: "snap",
        slides: { perView: 1.1, spacing: 15 },
        breakpoints: {
            "(min-width: 768px)": {
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

    if (loading) {
        return <p className="text-center py-10">Loading pricing...</p>;
    }

    return (
        <section className="py-16 relative bg-transparent">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: "url('/assets/home/pattern2.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    opacity: 0.2,
                }}
            ></div>

            {courses.map((course, idx) => (
                <div key={idx} className="max-w-6xl mx-auto px-6 mb-16">
                    <div className="text-center max-w-3xl mx-auto mb-8">
                        <motion.img
                            initial={{ opacity: 0, y: -50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            viewport={{ once: false }}
                            src="/assets/home/verse2.png"
                            alt="Quran verse"
                            className="mx-auto mb-6 md:w-[60%]"
                        />
                        <TextAnimate
                            animation="blurIn"
                            by="word"
                            duration={0.6}
                            as="h2"
                            className="text-2xl md:text-3xl font-bold mb-2 text-primary"
                        >
                            {course.title}
                        </TextAnimate>

                        <img
                            src="/assets/home/arrow.png"
                            alt="decorative arrow"
                            className="w-[200px] text-center mx-auto mb-2"
                        />

                        <p className="text-gray-600 mb-6">{course.summary}</p>
                    </div>

                    {/* Carousel */}
                    <div ref={sliderRef} className="keen-slider">
                        {course.plans.map((plan: any, pIdx: number) => (
                            <PricingCard
                                key={pIdx}
                                src={plan.src}
                                plan={plan}
                                courseId={course.id}
                            />
                        ))}
                    </div>

                    {/* Dots */}
                    {loaded && instanceRef.current && (
                        <div className="flex justify-center md:hidden gap-2 mt-2">
                            {[
                                ...Array(instanceRef.current.track.details.slides.length).keys(),
                            ].map((dotIdx) => (
                                <button
                                    key={dotIdx}
                                    onClick={() => instanceRef.current?.moveToIdx(dotIdx)}
                                    className={`w-2 h-2 rounded-full ${currentSlide === dotIdx ? "bg-primary" : "bg-gray-300"
                                        }`}
                                ></button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </section>
    );
}
