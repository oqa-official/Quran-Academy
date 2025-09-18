"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleX, CrossIcon } from "lucide-react";
// Assuming you have a custom utility function, please update the path if needed

export default function Page() {
  const [onboardingLink, setOnboardingLink] = useState<string | null>(null);

  useEffect(() => {
    // This code runs only on the client side after the component has mounted
    if (typeof window !== "undefined") {
      const storedLink = localStorage.getItem("onboardingLink");
      setOnboardingLink(storedLink);
    }
  }, []);

  return (
    <div className="relative min-h-screen flex justify-center items-center">
      {/* 🔹 Background Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/assets/home/pattern.png')" }}
      ></div>
      <div className="w-full max-w-2xl bg-white text-center rounded-2xl p-4 relative z-10">
        <Link href={'/'}>
        <div>
          <CircleX className="absolute top-2 right-2 hover:scale-105"/>
        </div>
        </Link>
        {/* Header */}
        <>
          <p className="text-2xl md:text-3xl my-2 text-accent">
            خَيْرُکُم مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
          </p>
          <p className="text-2xl md:text-3xl my-2 text-primary font-merriweather font-semibold">
            We have received your inquiry.
          </p>
        </>

        <img
          src={"/assets/home/arrow.png"}
          alt="arrow"
          className="max-w-[200px] mx-auto"
        />

        <div className="flex flex-col items-center space-y-4 mt-6">
          <img
            src="/assets/home/pricing2.png"
            alt="success"
            className="w-32 mx-auto"
          />
          <p className="text-lg font-normal text-gray-700">
            Thanks for the information
            <br /> You should receive the link on your number for further
            procedure.
          </p>
          
          {onboardingLink ? (
            <Link
              href={(onboardingLink)}
              className=" hover:underline text-accent"
            >
              Click here for the onboarding link
            </Link>
          ) : (
            <p className="text-gray-500">Loading onboarding link...</p>
          )}

          <Link href={onboardingLink ? onboardingLink : "#"}>
            <button
              className="px-4 py-2 rounded-sm bg-primary text-white hover:bg-accent"
            >
              Start Onboarding Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}