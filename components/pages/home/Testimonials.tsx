"use client";

import { TextAnimate } from "@/components/magicui/text-animate";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { reviews } from "@/lib/constants/reviews";



const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-start text-sm">{body}</blockquote>
    </figure>
  );
};

export default function TestimonialsSection() {
  return (
    <section
      className="relative py-20"
      style={{
        backgroundImage: "url('/assets/home/pattern.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/70"></div>

      <div className="relative text-center">
        {/* Verse */}
        <motion.img
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false }}
          src="/assets/home/verse5.png"
          alt="Quran verse"
          className="mx-auto mb-6 w-[50%]"
        />

        {/* Heading */}

        <TextAnimate animation="blurIn" by="word" duration={0.6} as="h2" className="text-2xl md:text-3xl -mt-3 font-bold mb-2 text-primary">
          What Our Students Say
        </TextAnimate>
        <img
          src="/assets/home/arrow.png"
          alt="Quran verse"
          className="w-[200px] text-center mx-auto mb-2"
        />

        {/* Subtext */}
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Hear directly from our students around the world who are learning the
          Quran with us. Their experiences reflect our commitment to authentic
          and effective Quran education.
        </p>

        {/* Reviews Marquee */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          {/* Gradient fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white"></div>
        </div>
      </div>
    </section>
  );
}
