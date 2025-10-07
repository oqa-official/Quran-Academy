

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Turnstile from "react-turnstile";

export default function ForgotPasswordPage() {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [identifier, setIdentifier] = useState(""); // userId or educationMail
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0); // seconds remaining

  // 🕒 Check cooldown on mount
  useEffect(() => {
    const storedTime = localStorage.getItem("forgotCooldown");
    if (storedTime) {
      const diff = Math.floor((Number(storedTime) - Date.now()) / 1000);
      if (diff > 0) setCooldown(diff);
    }
  }, []);

  // ⏳ Countdown updater
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("forgotCooldown");
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cooldown > 0) {
      toast.error(`Please wait ${cooldown}s before trying again.`);
      return;
    }

    setLoading(true);

    if (!captchaVerified) {
      toast.error("Please verify the captcha before submitting.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      toast.success(data.message);

      // 🕒 Start 2-minute cooldown (120s)
      const expiry = Date.now() + 120 * 1000;
      localStorage.setItem("forgotCooldown", expiry.toString());
      setCooldown(120);
    } catch (err: any) {
      toast.error(err.message || "Failed to recover account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center px-2 bg-gray-50">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/assets/home/pattern.png')" }}
      ></div>

      <div className="w-full max-w-md bg-white text-center rounded-2xl p-6 relative z-10 shadow-md">
        <p className="text-2xl md:text-3xl my-4 text-primary font-merriweather font-semibold">
          Recover Your Account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your User ID or Educational Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-accent focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : cooldown > 0
              ? `Try again in ${cooldown}s`
              : "Recover Account"}
          </button>

          <div className="flex justify-center items-start">
            <Turnstile
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              theme="light"
              size="normal"
              onVerify={() => setCaptchaVerified(true)}
              onError={() => setCaptchaVerified(false)}
              onExpire={() => setCaptchaVerified(false)}
            />
          </div>
        </form>

        <p className="mt-4 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-accent hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
