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
            phone: number;
            level: string;
            classDays: string[];
            timezone: string;
            startTime: string;
            price: number;
        }[],
    });

    const goNext = () => setStep((prev) => Math.min(prev + 1, 2));
    const goBack = () => setStep((prev) => Math.max(prev - 1, 1));
    const [loading, setLoading] = useState(false);

    // 🟢 Final submission
  const handleSubmit = async (finalData: typeof formData) => {
  setLoading(true);
  console.log("Submitting with:", finalData);

  try {
    const res = await fetch("/api/db/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalData),
    });

    const data = await res.json();

    if (!res.ok) {
      // If backend sent a clue (error field), show that
      toast.error(data.error || "Submission failed. Please try again.");
      setLoading(false);
      return;
    }

    toast.success("Submission Successful. Thank you!");
    router.push("/onboarding/success");
  } catch (err: any) {
    console.error("Error submitting onboarding:", err);
    toast.error(err.message || "Submission failed. Please try again.");
  } finally {
    setLoading(false);
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
                            loading={loading}
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
