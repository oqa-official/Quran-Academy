



"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { toast } from "sonner";
import Turnstile from "react-turnstile";


export default function NumberCollection({ onSuccess }: { onSuccess?: () => void }) {
  const [inputs, setInputs] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false); // ✅ new state
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (phone: string) => {
    setInputs({ ...inputs, phone });
  };

  // ✅ Google reCAPTCHA verification callback
  const handleCaptchaChange = (value: string | null) => {
    if (value) setCaptchaVerified(true);
    else setCaptchaVerified(false);
  };

  const validateForm = () => {
    if (!inputs.name || !inputs.email || !inputs.phone)
      return "All fields are required";

    if (inputs.name.length < 4 || inputs.name.length > 20)
      return "Name must be between 4 and 20 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputs.email))
      return "Please enter a valid email";

    if (!captchaVerified)
      return "Please complete reCAPTCHA verification";

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

      if (!res.ok) throw new Error("Failed to submit");
      const data = await res.json();

      const onboardingPath = `/onboarding/${data._id}`;
      localStorage.setItem("onboardingLink", onboardingPath);

      toast.success("Inquiry submitted successfully!");
      if (onSuccess) onSuccess();
      router.push("/inquire/successful");
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
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

        <div className="mt-3">
          <PhoneInput
            defaultCountry="us"
            value={inputs.phone}
            preferredCountries={["us", "gb", "ca", "au"]}
            onChange={handlePhoneChange}
            inputClassName="w-full border rounded-sm p-2 bg-transparent"
            className="bg-transparent"
          />
        </div>

        {/* ✅ Real Google reCAPTCHA */}
        <div className="mt-3 flex justify-center">
          <Turnstile
           theme="light"
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onVerify={(token) => setCaptchaVerified(true)}
            onError={() => setCaptchaVerified(false)}
          />
        </div>

        {error && <p className="text-red-500 text-xs mt-2 text-start">{error}</p>}

        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 px-4 py-2 rounded-sm font-medium ${loading ? "bg-primary cursor-wait text-white" : "bg-primary hover:bg-accent text-white"
              }`}
          >
            {loading && <Loader2 className="animate-spin w-4 h-4" />}
            {loading ? "Submitting..." : "Enroll Now For Free"}
          </button>
        </div>
      </div>
    </div>
  );
}
