








import { useState } from "react";
import FormWrapper from "./FormWrapper";

// Import the phone number input component and its CSS
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function StepFour({ formData, setFormData, goNext, goBack }: any) {
  const [inputs, setInputs] = useState({
    name: formData.name || "",
    email: formData.email || "",
    phone: formData.phone || "",
  });

  const handleChange = (e: any) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value: string | undefined) => {
    setInputs({ ...inputs, phone: value || "" });
  };

  const handleNext = () => {
    setFormData({ ...formData, ...inputs });
    goNext();
  };

  const isDisabled = !inputs.name || !inputs.email || !inputs.phone;

  return (
    <FormWrapper
      title="Your Details"
      verse="Please provide your information and preferences."
      aayat="ٱلْـحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ"
      step={4}
      totalSteps={5}
      hideProgress={true}
    >
      <div className="grid grid-cols-1 gap-4">
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
          className="w-full border rounded-sm p-2 "
        />
      </div>

       <PhoneInput
          defaultCountry="US"
          value={inputs.phone}
          onChange={handlePhoneChange}
          placeholder="Enter phone number"
          className="custom-phone-input mt-3 px-3!" // This is a custom class for styling
        />

      <div className="flex justify-between mt-6">
        <button className="px-4 py-2 rounded-sm bg-gray-200 hover:bg-gray-400" onClick={goBack}>
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