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
            {/* Who is this for? */}
            <label className="block my-2 mt-10 text-start">Who are you choosing for?</label>
            <div className="flex gap-3 justify-start mb-6">
                {["myself", "children"].map((type) => (
                    <label
                        key={type}
                        className={`flex items-center text-xs justify-center px-4 py-2 rounded-full cursor-pointer border transition ${forWhom === type
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-300"
                            }`}
                    >
                        <input
                            type="radio"
                            name="forWhom"   // ❌ was "userType"
                            value={type}
                            checked={forWhom === type}
                            onChange={() => setForWhom(type)}
                            className="hidden"
                        />

                        <span className="capitalize text-sm">
                            {type === "myself" ? "For Myself" : "For My Children"}
                        </span>
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
                        {[1, 2, 3, 4, 5].map((num) => (
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
                                value={6}
                                checked={studentCount === 6}
                                onChange={() => setStudentCount(6)}
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
