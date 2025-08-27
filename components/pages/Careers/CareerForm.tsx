"use client";

import React, { useState } from "react";
import QuestionnaireStep from "./QuestionnaireStep";
import PersonalVerificationStep from "./PersonalVerificationStep";
import FormNavigation from "./FormNavigation";

const CareerForm: React.FC = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  return (
    <div className="bg-gray-50 p-6 w-full rounded-lg shadow-md max-w-3xl">
      {/* Tabs */}
      <div className="flex mb-6 border-b text-sm">
        <button
          className={`flex-1 py-3 text-center font-medium ${
            step === 1 ? "border-b-2 border-primary text-primary" : "text-gray-500"
          }`}
          onClick={() => setStep(1)}
        >
          Questionnaire
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium ${
            step === 2 ? "border-b-2 border-primary text-primary" : "text-gray-500"
          }`}
          onClick={() => setStep(2)}
        >
          Personal Verification
        </button>
      </div>

      {/* Step Content */}
      {step === 1 && <QuestionnaireStep />}
      {step === 2 && <PersonalVerificationStep />}

      {/* Navigation */}
      <FormNavigation
        step={step}
        totalSteps={2}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default CareerForm;
