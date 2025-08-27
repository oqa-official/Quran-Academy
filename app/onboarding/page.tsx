"use client";
import StepOne from "@/components/pages/Onboarding/StepOne";
import StepThree from "@/components/pages/Onboarding/StepThree";
import StepTwo from "@/components/pages/Onboarding/StepTwo";
import { useState } from "react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userType: "",   // "myself" | "child"
    level: "",      // "basic" | "intermediate" | "advanced"
    name: "",
    email: "",
    phone: ""
  });

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative"
    style={{
        backgroundImage: "url('/assets/home/pattern.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {step === 1 && (
        <StepOne formData={formData} setFormData={setFormData} goNext={goNext} />
      )}
      {step === 2 && (
        <StepTwo
          formData={formData}
          setFormData={setFormData}
          goNext={goNext}
          goBack={goBack}
        />
      )}
      {step === 3 && <StepThree goBack={goBack} />}
    </div>
  );
}
