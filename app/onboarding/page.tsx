'use client'
import FormWrapper from "@/components/pages/Onboarding/FormWrapper";
import StepFive from "@/components/pages/Onboarding/StepFive";
import StepFour from "@/components/pages/Onboarding/StepFour";
import StepOne from "@/components/pages/Onboarding/StepOne";
import StepThree from "@/components/pages/Onboarding/StepThree";
import StepTwo from "@/components/pages/Onboarding/StepTwo";
import { useState } from "react";


export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    userType: "",
    level: "",
    studentCount: "",
    teacherPref: "",
    startDate: "",
    startTime: "",
    timezone: "",
    name: "",
    email: "",
    phone: "",
  });

  const goNext = () => setStep((prev) => Math.min(prev + 1, 5));
  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const progress = (step / 5) * 100;

  const handleSubmit = async () => {
    try {
      console.log("Submitting formData: ", formData);
      goNext();
    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center">
      {/* 🔹 Background Overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/assets/home/pattern.png')" }}
      ></div>

      {/* 🔹 Content */}
      <div className="container relative z-10 flex items-center justify-center">
        <FormWrapper step={step} totalSteps={5}>
          {step === 1 && (
            <StepOne
              formData={formData}
              setFormData={setFormData}
              goNext={goNext}
              showProgress={true}
            />
          )}

          {step === 2 && (
            <StepTwo
              formData={formData}
              setFormData={setFormData}
              goNext={goNext}
              goBack={goBack}
            />
          )}

          {step === 3 && (
            <StepThree
              formData={formData}
              setFormData={setFormData}
              goBack={goBack}
              goNext={goNext}
            />
          )}

          {step === 4 && (
            <StepFour
              formData={formData}
              setFormData={setFormData}
              goBack={goBack}
              goNext={goNext}
            />
          )}

          {step === 5 && (
            <StepFive
              formData={formData}
              goBack={goBack}
            />
          )}
        </FormWrapper>
      </div>
    </div>
  );
}
