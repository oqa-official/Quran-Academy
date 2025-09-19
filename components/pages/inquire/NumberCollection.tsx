"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { toast } from "sonner";

export default function NumberCollection({ onSuccess }: { onSuccess?: () => void }) {
  const [inputs, setInputs] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notRobot, setNotRobot] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (phone: string) => {
    setInputs({ ...inputs, phone });
  };

  const validateForm = () => {
    if (!inputs.name || !inputs.email || !inputs.phone) {
      return "All fields are required";
    }
    if (inputs.name.length < 4 || inputs.name.length > 20) {
      return "Name must be between 4 and 20 characters";
    }
    if (inputs.phone.length < 7 || inputs.phone.length > 20) {
      return "Please enter a valid phone number";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputs.email)) {
      return "Please enter a valid email";
    }
    if (!notRobot) {
      return "Please confirm you are not a robot";
    }
    return "";
  };

 const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError("");
      setLoading(true);

      const res = await fetch("/api/db/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      const data = await res.json(); // ✅ backend should return { id: "..."}
      const inquiryId = data._id;

      // ✅ Store onboarding link in localStorage
      const onboardingPath = `/onboarding/${inquiryId}`;
      localStorage.setItem("onboardingLink", onboardingPath);

      // ✅ Toast message
      toast.success(`Inquiry submitted successfully!`);

      // ✅ Trigger optional callback
      if (onSuccess) {
        onSuccess();
      }

      // ✅ Navigate to onboarding or success page
      router.push('/inquire/successful');

    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full h-full text-center rounded-2xl md:mt-10 mt-5 relative z-10">
      <div>
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
            className="w-full border rounded-sm p-2"
          />
        </div>

        {/* ✅ Updated Phone Input with Search + Flag + Dial Code */}
        <div className="mt-3">
          <PhoneInput
            defaultCountry="us"
            value={inputs.phone}
             preferredCountries={["us", "gb", "ca", "au"]}
            onChange={handlePhoneChange}
            inputClassName="w-full border rounded-sm p-2 bg-transparent"
            className="bg-transparent"
            countrySelectorStyleProps={{
            }}
          />
        </div>

        {/* ✅ Fake reCAPTCHA */}
        <div className="flex items-center mt-2 justify-between border rounded-md px-3 py-4 text-sm text-gray-700 bg-white w-full">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notRobot}
              onChange={(e) => setNotRobot(e.target.checked)}
              className="w-5 h-5 border-gray-400 accent-accent"
            />
            <span>I’m not a robot</span>
          </div>
          <img
            src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
            alt="reCAPTCHA"
            className="h-6"
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs mt-2 text-start">{error}</p>
        )}

        <div className="mt-6">
          <button
            className={`flex w-full items-center justify-center gap-2 px-4 py-2 rounded-sm font-medium ${
              loading
                ? "bg-primary text-white cursor-wait"
                : "bg-primary text-white hover:bg-accent"
            }`}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading && <Loader2 className="animate-spin w-4 h-4" />}
            {loading ? "Submitting..." : "Enroll Now For Free"}
          </button>
        </div>
      </div>
    </div>
  );
}
