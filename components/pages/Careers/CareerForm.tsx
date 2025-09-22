
"use client";

import React, { useState } from "react";
import QuestionnaireStep from "./QuestionnaireStep";
import FormNavigation from "./FormNavigation";
import PersonalVerificationStep from "./PersonalVerificationStep";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = "Quran_Academy";

const CareerForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    intro: "",
    taughtBefore: "",
    englishRating: "",
    englishExplain: "",
    quranRating: "",
    quranExplain: "",
    email: "",
    name: "",
    phone: "",
    files: {
      idFront: null,
      idBack: null,
      quranCert: null,
      educationCert: null,
    },
    captcha: false,
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🔼 Cloudinary upload util
  const uploadFile = async (file: File, resourceType: "image" | "auto" = "auto") => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    form.append("folder", "teacher_inquiries");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  };

  // ✅ Validation before moving forward
  const validateStep = () => {
    let stepErrors: any = {};
    if (step === 1) {
      if (!formData.intro || formData.intro.length < 100)
        stepErrors.intro = "Introduce yourself (min 100 letters)";
      if (!formData.taughtBefore || formData.taughtBefore.length < 100)
        stepErrors.taughtBefore = "Teaching exp required, Min 100 Letters";
      if (!formData.englishRating)
        stepErrors.englishRating = "Select English rating";
      if (!formData.englishExplain || formData.englishExplain.length < 100)
        stepErrors.englishExplain = "Explain English rating | Min 100 letters";
      if (!formData.quranRating)
        stepErrors.quranRating = "Select Quranic rating";
      if (!formData.quranExplain || formData.quranExplain.length < 100)
        stepErrors.quranExplain = "Explain Quranic rating | min 100 letters";
    }

    if (step === 2) {
      if (!formData.email.includes("@"))
        stepErrors.email = "Valid email required";
      if (!formData.name || formData.name.length < 4)
        stepErrors.name = "Add Full Name";
      if (!formData.phone)
        stepErrors.phone = "Phone number is required";
      if (!formData.files.idFront)
        stepErrors.idFront = "Front ID required";
      if (!formData.files.idBack)
        stepErrors.idBack = "Back ID required";
      if (!formData.files.quranCert)
        stepErrors.quranCert = "Quran certificate required";
      if (!formData.files.educationCert)
        stepErrors.educationCert = "Education certificate required";
      if (!formData.captcha) stepErrors.captcha = "Please verify captcha";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      // 🔼 Upload files
      const idFrontData = await uploadFile(formData.files.idFront, "image");
      const idBackData = await uploadFile(formData.files.idBack, "image");
      const quranCertData = await uploadFile(formData.files.quranCert, "auto");
      const eduCertData = await uploadFile(formData.files.educationCert, "auto");

      // 🔼 Send to backend
      const res = await fetch("/api/db/teacher-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intro: formData.intro,
          taughtBefore: formData.taughtBefore,
          englishRating: formData.englishRating,
          englishExplain: formData.englishExplain,
          quranRating: formData.quranRating,
          quranExplain: formData.quranExplain,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,

          // 🟢 file URLs + IDs
          cnicFrontUrl: idFrontData.secure_url,
          cnicFrontCloudinaryId: idFrontData.public_id,
          cnicBackUrl: idBackData.secure_url,
          cnicBackCloudinaryId: idBackData.public_id,
          qualificationUrl: eduCertData.secure_url,
          qualificationCloudinaryId: eduCertData.public_id,
          experienceUrl: quranCertData.secure_url,
          experienceCloudinaryId: quranCertData.public_id,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit teacher inquiry");

      toast.success("Application submitted successfully!");
      setFormData({
        intro: "",
        taughtBefore: "",
        englishRating: "",
        englishExplain: "",
        quranRating: "",
        quranExplain: "",
        email: "",
        name: "",
        phone: "",
        files: { idFront: null, idBack: null, quranCert: null, educationCert: null },
        captcha: false,
      });
      setStep(1);
      router.push("/")
    } catch (err: any) {
      toast.error(err.message || "Error submitting form.");
    } finally {
      setLoading(false);
    }
  };

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
          onClick={() => step > 1 && setStep(2)}
        >
          Personal Verification
        </button>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <QuestionnaireStep
          data={formData}
          onChange={(f, v) => setFormData({ ...formData, [f]: v })}
          errors={errors}
        />
      )}
      {step === 2 && (
        <PersonalVerificationStep
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />
      )}

      {/* Navigation */}
      <FormNavigation
        step={step}
        totalSteps={2}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default CareerForm;
