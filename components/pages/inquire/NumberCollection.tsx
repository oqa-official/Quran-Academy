







"use client";

import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NumberCollection() {
  const [scene, setScene] = useState<1 | 2>(1);
  const [inputs, setInputs] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value: string | undefined) => {
    setInputs({ ...inputs, phone: value || "" });
  };

  const validateForm = () => {
    if (!inputs.name || !inputs.email || !inputs.phone) {
      return "All fields are required";
    }
    if (inputs.name.length < 4 || inputs.name.length > 20) {
      return "Name must be between 4 and 20 characters";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputs.email)) {
      return "Please enter a valid email";
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

      // 🔹 API call to your inquire endpoint
      const res = await fetch("/api/db/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      const data = await res.json();
      console.log("Form submitted:", data);

      setScene(2); // success scene
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white text-center rounded-2xl p-4 relative z-10">
      {/* Header */}
      {scene === 1 ? (
        <>
          <p className="text-2xl md:text-3xl my-2 text-accent">
            بِسْمِ ٱللهِ ٱلرَّحْمَٰنِ ٱلرَّحِيْمِ
          </p>
          <p className="text-2xl md:text-3xl my-2 text-primary font-merriweather font-semibold">
            Fill the Below Details
          </p>
        </>
      ) : (
        <>
          <p className="text-2xl md:text-3xl my-2 text-accent">
            جَزَاكُمُ ٱللَّهُ خَيْرًا
          </p>
          <p className="text-2xl md:text-3xl my-2 text-primary font-merriweather font-semibold">
            Thank you for your response.
          </p>
        </>
      )}

      <img
        src={"/assets/home/arrow.png"}
        alt="arrow"
        className="max-w-[200px] mx-auto"
      />

      {/* Scene 1 - Form */}
      {scene === 1 && (
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
              international
              defaultCountry="US"
              value={inputs.phone}
              onChange={handlePhoneChange}
              placeholder="Enter phone number"
              className="phone-input w-full border rounded-sm p-2"
            />
          </div>

          {error && <p className="text-red-500 mt-2 text-start">{error}</p>}

          <div className="mt-6">
            <button
              className={`flex w-full items-center justify-center gap-2 px-4 py-2 rounded-sm font-medium ${
                loading
                  ? "bg-gray-400 cursor-wait"
                  : "bg-primary text-white hover:bg-accent"
              }`}
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading && <Loader2 className="animate-spin w-4 h-4" />}
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {/* Scene 2 - Success */}
      {scene === 2 && (
        <div className="flex flex-col items-center space-y-4 mt-6">
          <img
            src="/assets/home/pricing2.png"
            alt="success"
            className="w-32 mx-auto"
          />
          <h3 className="text-lg font-normal text-gray-700">
            Thanks for the info! 📩<br /> You should receive the link on your
            number for further procedure.
          </h3>
          <button
            className="px-4 py-2 rounded-sm bg-primary text-white hover:bg-accent"
            onClick={() => router.push("/")}
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}
