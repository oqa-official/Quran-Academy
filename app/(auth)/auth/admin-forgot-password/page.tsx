"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Turnstile from "react-turnstile";

export default function ForgotPasswordPage() {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);

  // ✅ Check cooldown from localStorage on load
  useEffect(() => {
    const cooldownTimestamp = localStorage.getItem("admin-forgot-cooldown");
    if (cooldownTimestamp) {
      const remaining = Math.max(
        0,
        parseInt(cooldownTimestamp) - Date.now()
      );
      if (remaining > 0) {
        setCooldown(Math.ceil(remaining / 1000));
      } else {
        localStorage.removeItem("admin-forgot-cooldown");
      }
    }
  }, []);

  // ✅ Countdown effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("admin-forgot-cooldown");
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cooldown > 0) {
      toast.error(`Please wait ${cooldown} seconds before trying again.`);
      return;
    }

    if (!captchaVerified) {
      toast.error("Please verify the captcha before submitting.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      toast.success(`${data.message}`);

      // ✅ Set cooldown (5 minutes)
      const delay = 5 * 60 * 1000;
      const expireAt = Date.now() + delay;
      localStorage.setItem("admin-forgot-cooldown", expireAt.toString());
      setCooldown(delay / 1000);
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
              ? `Wait ${cooldown}s before trying again`
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
          <Link href="/auth/admin-login" className="text-accent hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
