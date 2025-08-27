import { useState } from "react";
import FormWrapper from "./FormWrapper";

export default function StepTwo({ formData, setFormData, goNext, goBack }: any) {
  const [inputs, setInputs] = useState({
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
  });

  const handleChange = (e: any) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setFormData({ ...formData, ...inputs });
    goNext();
  };

  const isDisabled = !inputs.name || !inputs.email || !inputs.phone;

  return (
    <FormWrapper
      title="Your Details"
      verse="Please provide your information so we can contact you."
      aayat="ٱلْـحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ"
    >
      <div className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={inputs.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full border rounded-sm p-2"
        />
        <input
          type="email"
          name="email"
          value={inputs.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full border rounded-sm p-2"
        />
        <input
          type="tel"
          name="phone"
          value={inputs.phone}
          onChange={handleChange}
          placeholder="Your Phone Number"
          className="w-full border rounded-sm p-2"
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 rounded-sm bg-gray-200 hover:bg-gray-400"
          onClick={goBack}
        >
          Back
        </button>
        <button
          className={`px-4 py-2 rounded-sm font-medium ${
            isDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-primary text-white hover:bg-accent"
          }`}
          disabled={isDisabled}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </FormWrapper>
  );
}
