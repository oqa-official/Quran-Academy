"use client";
import { useState } from "react";
import FormWrapper from "../FormWrapper";

export default function StepOne({ formData, setFormData, goNext }: any) {
    //   const [userType, setUserType] = useState(formData.userType || "");
    const [forWhom, setForWhom] = useState(formData.forWhom || "");

    const [studentCount, setStudentCount] = useState(formData.studentCount || 1);

    const handleNext = () => {
        setFormData({ ...formData, forWhom, studentCount });
        goNext();
    };

    return (
        <FormWrapper
            title="Start Your Journey"
            verse="Fill the form and claim your free trial classes."
            aayat="ٱلْـحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ"
            step={1}
            totalSteps={2}
            hideProgress
        >
            <label className="block my-2 mt-10 text-start">
                Who are you choosing for?
            </label>

            <div className="flex gap-4 justify-start mb-6">
                {[
                    { type: "myself", label: "For Myself", img: "/assets/onboard/man.png" },
                    { type: "children", label: "For My Children", img: "/assets/onboard/children.png" },
                ].map(({ type, label, img }) => (
                    <label
                        key={type}
                        className={`relative cursor-pointer overflow-hidden w-40 h-44 rounded-xl border flex flex-col items-center justify-center p-4 transition-all
                        ${forWhom === type
                                ? "bg-primary border-primary text-white shadow-lg"
                                : "bg-white border-gray-300 text-gray-700"
                            }`}
                    >
                        {/* hidden input */}
                        <input
                            type="radio"
                            name="forWhom"
                            value={type}
                            checked={forWhom === type}
                            onChange={() => setForWhom(type)}
                            className="hidden"
                        />

                        {/* Image with grayscale if not selected */}

                        
                        {/* Label */}
                        <span className="text-sm font-medium mb-2">{label}</span>
                        <img
                            src={img}
                            alt={label}
                            className={`w-[200px] overflow-hidden -mb-9 object-contain transition-all duration-200
                                        ${forWhom === type ? "grayscale-0" : "grayscale opacity-70"}
        `}
                        />

                    </label>
                ))}
            </div>


            {/* Student Count if children */}
            {forWhom === "children" && (
                <div className="mb-6">
                    <label className="block mb-2 text-start">
                        How many children will you add?
                    </label>
                    <div className="flex gap-3 justify-start flex-wrap">
                        {[1, 2, 3, 4].map((num) => (
                            <label
                                key={num}
                                className={`flex items-center text-xs justify-center w-10 h-10 p-3 rounded-full cursor-pointer border transition ${studentCount === num
                                    ? "bg-primary text-white border-primary"
                                    : "bg-white text-gray-700 border-gray-300"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="studentCount"
                                    value={num}
                                    checked={studentCount === num}
                                    onChange={() => setStudentCount(num)}
                                    className="hidden"
                                />
                                {num}
                            </label>
                        ))}

                        {/* ✅ 5+ option → sets value = 6 in state */}
                        <label
                            key="5plus"
                            className={`flex items-center text-xs justify-center w-12 h-10 px-3 rounded-full cursor-pointer border transition ${studentCount === 6
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-gray-700 border-gray-300"
                                }`}
                        >
                            <input
                                type="radio"
                                name="studentCount"
                                value={5}
                                checked={studentCount === 5}
                                onChange={() => setStudentCount(5)}
                                className="hidden"
                            />
                            5+
                        </label>
                    </div>
                </div>
            )}



            {/* Next button */}
            <button
                disabled={!forWhom}
                onClick={handleNext}
                className={`w-full py-2 rounded-lg font-semibold ${!forWhom
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-accent"
                    }`}
            >
                Next
            </button>
        </FormWrapper>
    );
}
