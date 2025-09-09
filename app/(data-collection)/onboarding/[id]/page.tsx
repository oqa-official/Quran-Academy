'use client';

import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import FormWrapper from "@/components/pages/Onboarding/FormWrapper";
import StepOne from "@/components/pages/Onboarding/new/StepOne";
import StepTwo from "@/components/pages/Onboarding/new/StepTwo";
import { toast } from "sonner";


export default function OnboardingPage() {
    const router = useRouter();
    const { id } = useParams();

    const [step, setStep] = useState(1);

    // 🟢 Form data structure
    const [formData, setFormData] = useState({
        parentInquiry: id,
        forWhom: "", // "myself" | "children"
        studentCount: 1,
        students: [] as {
            name: string;
            email: string;
            phone: string;
            age: string;
            level: string;
            classDays: string[];
            timezone: string;
            startTime: string;
            price: number;
        }[],
    });

    const goNext = () => setStep((prev) => Math.min(prev + 1, 2));
    const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

    // 🟢 Final submission
    // 🟢 Final submission
    const handleSubmit = async (finalData: typeof formData) => {
        console.log("Submitting with:", finalData);

        try {
            const res = await fetch("/api/db/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalData),
            });

            if (!res.ok) throw new Error("Submission failed");
             toast.success("Submission Successful. Thank you!");

            router.push("/onboarding/success");
        } catch (err) {
            console.error("Error submitting onboarding:", err);
            toast.error("Submission failed. Please try again.");
        }
    };



    return (
        <div className="relative min-h-screen flex justify-center items-center">
            {/* Background Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
                style={{ backgroundImage: "url('/assets/home/pattern.png')" }}
            ></div>

            {/* Content */}
            <div className="container relative z-10 flex items-center justify-center my-20">
                <FormWrapper step={step} totalSteps={2}>
                    {step === 1 && (
                        <StepOne
                            formData={formData}
                            setFormData={setFormData}
                            goNext={goNext}
                        />
                    )}

                    {step === 2 && (
                        <StepTwo
                            formData={formData}
                            setFormData={setFormData}
                            goBack={goBack}
                            handleSubmit={handleSubmit}
                        />
                    )}
                </FormWrapper>
            </div>
        </div>
    );
}
