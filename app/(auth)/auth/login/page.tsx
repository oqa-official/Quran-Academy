
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const { setUser, role } = useUser();
  const router = useRouter();

  if(role){
    if(role === 'admin'){
      router.push("/admin-dashboard")
      return
    }
    if(role === 'instructor'){
      router.push("/teacher-dashboard")
      return
    }
    if(role === 'student'){
      router.push("/students-dashboard")
      return
    }
  }


  const [form, setForm] = useState({
    educationMail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.educationMail || !form.password) {
      toast.error("Both fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("🔍 Login response:", data);

      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }

      toast.success("Login successful!");
      setUser(data._id, data.role);

      // 🔹 Role-based redirect on frontend
      switch (data.role) {
        case "admin":
          router.push("/admin-dashboard");
          break;
        case "instructor":
          router.push("/teacher-dashboard");
          break;
        case "student":
          router.push("/student-dashboard");
          break;
        default:
          router.push("/"); // fallback
      }
    } catch (err: any) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center px-2">
      {/* 🔹 Background Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/assets/home/pattern.png')" }}
      ></div>

      <div className="w-full max-w-md bg-white text-center rounded-2xl p-6 relative z-10 shadow-md">
        {/* Header */}
        <p className="text-2xl md:text-3xl my-2 text-accent">
          إِنَّمَا الْأَعْمَالُ بِالنِّيَّات
        </p>
        <p className="text-2xl md:text-3xl my-4 text-primary font-merriweather font-semibold">
          Login to Your Account
        </p>
        <img
          src={"/assets/home/arrow.png"}
          alt="arrow"
          className="w-full max-w-[200px] mx-auto"
        />

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4 mt-6"
        >
          <div className="flex flex-col justify-center items-start w-full">
            <label className="text-start text-gray-500 text-xs mb-1">
              Your Educational Email
            </label>
            <input
              type="email"
              name="educationMail"
              placeholder="Educational Email"
              value={form.educationMail}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="flex flex-col justify-center items-start w-full">
            <label className="text-start text-gray-500 text-xs mb-1">
              Your Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-md bg-primary text-white hover:bg-accent disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-4 text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link href="/auth/register" className="text-accent hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
