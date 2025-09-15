"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [selected, setSelected] = useState<"student" | "teacher" | null>(null);
  const router = useRouter();

  const handleProceed = () => {
    if (selected === "student") {
      router.push("/auth/register/student");
    } else if (selected === "teacher") {
      router.push("/auth/register/teacher");
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center px-2 bg-gray-50">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/assets/home/pattern.png')" }}
      ></div>

      <div className="w-full max-w-md bg-white text-center rounded-2xl p-6 relative z-10 shadow-md">
        <p className="text-2xl md:text-3xl my-2 text-accent">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>
        <p className="text-2xl md:text-3xl my-4 text-primary font-merriweather font-semibold">
          Register new Account
        </p>
        <img
          src={"/assets/home/arrow.png"}
          alt="arrow"
          className="w-full max-w-[200px] mx-auto"
        />

        {/* Cards */}
        <div className="flex gap-4 justify-center my-6">
          {[
            { type: "student", label: "Student", img: "/assets/onboard/children.png" },
            { type: "teacher", label: "Teacher", img: "/assets/onboard/man.png" },
          ].map(({ type, label, img }) => (
            <label
              key={type}
              className={`relative cursor-pointer overflow-hidden w-40 h-44 rounded-xl border flex flex-col items-center justify-center p-4 transition-all
              ${selected === type
                  ? "bg-primary border-primary text-white shadow-lg"
                  : "bg-white border-gray-300 text-gray-700"
                }`}
            >
              <input
                type="radio"
                name="userType"
                value={type}
                checked={selected === type}
                onChange={() => setSelected(type as "student" | "teacher")}
                className="hidden"
              />

              <span className="text-sm font-medium mb-2">{label}</span>
              <img
                src={img}
                alt={label}
                className={`w-[200px] overflow-hidden -mb-9 object-contain transition-all duration-200
                  ${selected === type ? "grayscale-0" : "grayscale opacity-70"}
                `}
              />
            </label>
          ))}
        </div>

        {/* Proceed button */}
        <button
          disabled={!selected}
          onClick={handleProceed}
          className={`w-full py-2 rounded-lg font-normal ${!selected
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-primary text-white hover:bg-accent"
            }`}
        >
          Proceed
        </button>

        {/* Already have account */}
        <p className="mt-4 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-accent hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
