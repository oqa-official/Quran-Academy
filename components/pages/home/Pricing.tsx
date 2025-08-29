"use client";
import { TextAnimate } from "@/components/magicui/text-animate";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const courses = [
  {
    title: "Learn Quranic Studies for Beginner (Level-I)",
    price: 25,
    days_week: "2 Days/Week",
    src: "/assets/home/pricing1.png",
    features: [
      "30 min lessons",
      "8 Classes/Month",
      "4 hours/Month",
      "24/7 Support",
    ],
  },
  {
    title: "Learn Recitation of Quran (Level-II)",
    price: 35,
    days_week: "3 Days/Week",
    src: "/assets/home/pricing2.png",
    features: [
      "30 min lessons",
      "12 Classes/Month",
      "6 hours/Month",
      "24/7 Support",
    ],
  },
  {
    title: "Learn Quran with Tajweed (Level-III)",
    price: 45,
    days_week: "4 Days/Week",
    src: "/assets/home/pricing3.png",
    features: [
      "30 min lessons",
      "16 Classes/Month",
      "8 hours/Month",
      "24/7 Support",
    ],
  },
  {
    title: "Learn Quran with Tajweed (Level-IV)",
    price: 50,
    days_week: "5 Days/Week",
    src: "/assets/home/pricing4.png",
    features: [
      "30 min lessons",
      "20 Classes/Month",
      "10 hours/Month",
      "24/7 Support",
    ],
  },
];

function CourseCard({ src, price, days_week, features }: any) {
  return (
    <div className="keen-slider__slide p-2 py-4">
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
        <div className="p-3 bg-white group-hover:bg-primary group-focus:bg-primary group-active:bg-primary group-focus::bg-primary hover:bg-primary -mt-1 shadow-2xl shadow-black">
          <div className="text-primary bg-[#bababa33] scale-x-110 py-2 flex justify-center group-hover:text-white group-focus:text-white group-active:text-white">
            <span>{days_week}</span>
          </div>

          <img
            src={src}
            alt="Quran Learning"
            className="text-center absolute w-[30%] justify-center top-[45%] left-[50%] transform -translate-x-[50%] mx-auto -mt-50"
          />

          {/* Price */}
          <div className="text-center mb-10 mt-5">
            <div className="flex items-baseline justify-center space-x-1">
              <span className="text-xl self-start text-gray-600 group-hover:text-white group-focus:text-white group-active:text-white transition-colors">
                $
              </span>
              <h2 className="text-6xl font-bold text-gray-800 group-hover:text-white group-focus:text-white group-active:text-white transition-colors">
                {price}
              </h2>
              <span className="text-sm text-gray-600 group-hover:text-white group-focus:text-white group-active:text-white transition-colors">
                /month
              </span>
            </div>
            <hr className="w-full h-[2px] bg-black opacity-25 mt-3" />
          </div>

          {/* Features */}
          <ul className="space-y-2 mt-4">
            {features.map((item: string, idx: number) => (
              <li
                key={idx}
                className="flex items-start  text-gray-600 group-hover:text-white group-active:text-white group-focus:text-white transition-colors text-sm"
              >
                <Check className="w-4 h-4 mr-2 mt-1 text-gray-600 group-hover:text-white transition-colors group-active:text-white group-focus:text-white"  />
                {item}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="flex justify-center items-center space-x-2 mt-4 pt-2">
            <Button
              className="bg-transparent text-primary border-primary group-hover:text-white group-active:text-white group-focus:text-white group-hover:border-white group-active:border-white group-focus:border-white hover:bg-transparent rounded-[2px] mb-10"
              size={"lg"}
              variant={"outline"}
            >
              Signup Today
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

type Pricing_Props = {
  heading?: string;
  lamp?: boolean;
};

export default function Pricing_Section({
  heading = "Our Economical Pricing",
}: Pricing_Props) {
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
    <section className={`py-16 relative bg-transparent`}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/assets/home/pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.3,
        }}
      ></div>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-8">
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
          <img
            src="/assets/home/arrow.png"
            alt="decorative arrow"
            className="w-[200px] text-center mx-auto mb-2"
          />
          {/* Paragraph */}
          <p className="text-gray-600 mb-6">
            Quran Academy provides the intuitive tuition for the Alphabet Sound Recognition for all people who intend to learn the Holy Quran in a proper religious way.
          </p>
        </div>

        {/* Carousel */}
        <div ref={sliderRef} className="keen-slider">
          {courses.map((course, idx) => (
            <CourseCard key={idx} {...course} />
          ))}
        </div>

        {/* Dots */}
        {loaded && instanceRef.current && (
          <div className="flex justify-center md:hidden gap-2 mt-2">
            {[
              ...Array(instanceRef.current.track.details.slides.length).keys(),
            ].map((idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-2 h-2 rounded-full ${
                  currentSlide === idx ? "bg-primary" : "bg-gray-300"
                }`}
              ></button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
