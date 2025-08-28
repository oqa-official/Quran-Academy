// "use client";
// import { useState } from "react";

// // Steps
// import StepOne from "@/components/pages/Onboarding/StepOne";
// import StepTwo from "@/components/pages/Onboarding/StepTwo";
// import StepThree from "@/components/pages/Onboarding/StepThree"; // new calendly-like step
// import StepFour from "@/components/pages/Onboarding/StepFour";   // your old step three

// // Optional: if you already have a FormWrapper with progress bar
// import FormWrapper from "@/components/pages/Onboarding/FormWrapper";

// export default function OnboardingPage() {
//   const [step, setStep] = useState(1);

//   const [formData, setFormData] = useState({
//     userType: "",      // "myself" | "child"
//     level: "",         // "basic" | "intermediate" | "advanced"
//     studentCount: "",  // "1" | "2" | "3" | "4" | "5"
//     teacherPref: "",   // "male" | "female"
//     startDate: "",     // calendar selected date
//     startTime: "",     // calendar selected time
//     timezone: "",      // user’s timezone
//     name: "",
//     email: "",
//     phone: "",
//   });

//   const goNext = () => setStep((prev) => Math.min(prev + 1, 4));
//   const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

//   const progress = (step / 4) * 100; // progress bar

//   return (
//     <div
//       className="min-h-screen py-4 relative flex justify-center items-center"
//       style={{
//         // backgroundImage: "url('/assets/home/pattern.png')",
//         backgroundSize: "contain",
//         backgroundPosition: "center",
//       }}
//     >
//     <div className="container flex items-center justify-center  relative ">
//         <FormWrapper step={step} totalSteps={3} progress={progress}>
//         {step === 1 && (
//           <StepOne
//             formData={formData}
//             setFormData={setFormData}
//             goNext={goNext}
//           />
//         )}

//         {step === 2 && (
//           <StepTwo
//             formData={formData}
//             setFormData={setFormData}
//             goNext={goNext}
//             goBack={goBack}
//           />
//         )}

//         {step === 3 && (
//           <StepThree
//             formData={formData}
//             setFormData={setFormData}
//             goNext={goNext}
//             goBack={goBack}
//           />
//         )}

//         {step === 4 && (
//           <StepFour
//             formData={formData}
//             goBack={goBack}
//           />
//         )}
//       </FormWrapper>
//     </div>
//     </div>
//   );
// }














"use client";
import { useState } from "react";

// Steps
import StepOne from "@/components/pages/Onboarding/StepOne";
import StepTwo from "@/components/pages/Onboarding/StepTwo";
import StepThree from "@/components/pages/Onboarding/StepThree"; 
import StepFour from "@/components/pages/Onboarding/StepFour";   

import FormWrapper from "@/components/pages/Onboarding/FormWrapper";

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

  const goNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const progress = (step / 4) * 100; 

  // 👇 New: Final submit handler (can send to API / DB later)
  const handleSubmit = async () => {
    try {
      console.log("Submitting formData: ", formData);

      // Example: send to API
      // await fetch("/api/onboarding", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });

      // After submission, move to StepFour (confirmation)
      goNext();
    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  return (
    <div className="min-h-screen py-4 relative flex justify-center items-center">
      <div className="container flex items-center justify-center relative">
        <FormWrapper step={step} totalSteps={4} progress={progress}>
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
              goNext={goNext}
              goBack={goBack}
            />
          )}

          {step === 3 && (
            <StepThree
              formData={formData}
              setFormData={setFormData}
              goBack={goBack}
              onSubmit={handleSubmit}   // 👈 pass submit handler
            />
          )}

          {step === 4 && (
            <StepFour
              formData={formData}
              goBack={goBack}
            />
          )}
        </FormWrapper>
      </div>
    </div>
  );
}
