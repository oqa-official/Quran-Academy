"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  generateAvailableDates,
  generateTimeSlots,
  TIMEZONES,
} from "@/lib/constants/timezones";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useUser } from "@/context/UserContext";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const BASE_PRICE = 20;

interface StudentFormValues {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  frequency: number | "";
  classDays: string[];
  timezone: string;
  preferredStartDate: string;
  preferredStartTime: string;
  price: number;
  password: string;
}

export default function StudentRegisterForm() {
  const router = useRouter();
  const { setUser } = useUser();

  const [form, setForm] = useState<StudentFormValues>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    frequency: "",
    classDays: [],
    timezone: "",
    preferredStartDate: "",
    preferredStartTime: "",
    price: BASE_PRICE,
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleDay = (day: string) => {
    let selected = form.classDays || [];
    if (selected.includes(day)) {
      selected = selected.filter((d) => d !== day);
    } else {
      if (selected.length < (form.frequency || 2)) {
        selected = [...selected, day];
      } else {
        toast.error(`You can only select ${form.frequency || 2} days per week`);
        return;
      }
    }
    handleChange("classDays", selected);
  };

  const handleFrequency = (freq: number) => {
    let price = BASE_PRICE;
    if (freq === 3) price += 10;
    if (freq === 4) price += 20;
    if (freq === 5) price += 25;
    handleChange("frequency", freq);
    handleChange("price", price);
    handleChange("classDays", []);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.phone) newErrors.phone = "Phone is required";
    if (!form.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.frequency) newErrors.frequency = "Select classes/week";
    if (!form.classDays.length) newErrors.classDays = "Select class days";
    if (!form.timezone) newErrors.timezone = "Timezone is required";
    if (!form.preferredStartDate) newErrors.preferredStartDate = "Select preferred start date";
    if (!form.preferredStartTime) newErrors.preferredStartTime = "Select preferred start time";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = { ...form };

      const res = await fetch("/api/db/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Registration successful!");
      setUser(data._id, "student");
      router.push("/student-dashboard");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="flex flex-col justify-start">
          <label className="text-xs text-gray-500 mb-1 text-start">Name</label>
          <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Your name"
            className="border rounded-md h-10 px-3 w-full"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col justify-start">
          <label className="text-xs text-gray-500 mb-1 text-start">Email</label>
          <input
          placeholder="Email"
            value={form.email}
            type="email"
            onChange={(e) => handleChange("email", e.target.value)}
            className="border rounded-md h-10 px-3 w-full"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="flex flex-col justify-start text-start">
          <label className="text-xs text-gray-500 mb-1">Phone</label>
          <PhoneInput
            defaultCountry="us"
            value={form.phone}
            onChange={(val) => handleChange("phone", val)}
            inputClassName="w-full border rounded-md p-2"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col justify-start">
          <label className="text-xs text-gray-500 mb-1 text-start">Date of Birth</label>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            className="border rounded-md h-10 px-3 w-full"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Gender */}
        <div className="md:col-span-2 flex flex-col justify-start">
          <label className="text-xs text-gray-500 mb-1 text-start">Gender</label>
          <Select
            value={form.gender || undefined}
            onValueChange={(val) => handleChange("gender", val)}
          >
            <SelectTrigger className="border rounded-md h-10 w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>

        {/* Frequency */}
        <div className="flex flex-col justify-start">
          <label className="text-xs text-gray-500 mb-1 text-start">Classes/week</label>
          <Select
            value={form.frequency ? String(form.frequency) : undefined}
            onValueChange={(val) => handleFrequency(parseInt(val))}
          >
            <SelectTrigger className="border rounded-md h-10 w-full">
              <SelectValue placeholder="Select classes per week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Classes/week (${BASE_PRICE})</SelectItem>
              <SelectItem value="3">3 Classes/week (${BASE_PRICE + 10})</SelectItem>
              <SelectItem value="4">4 Classes/week (${BASE_PRICE + 20})</SelectItem>
              <SelectItem value="5">5 Classes/week (${BASE_PRICE + 25})</SelectItem>
            </SelectContent>
          </Select>
          {errors.frequency && (
            <p className="text-red-500 text-xs mt-1">{errors.frequency}</p>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col justify-start">
          <label className="text-xs text-gray-500 mb-1 text-start">Fee/Month in $</label>
          <input
            value={form.price}
            readOnly
            className="border rounded-md h-10 px-3 w-full bg-gray-100"
          />
        </div>

        {/* Class Days */}
        <div className="flex flex-col justify-start">
          <label className="text-xs text-gray-500 mb-1 text-start">Select Days</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border transition ${
                  form.classDays.includes(day)
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {day[0]}
              </button>
            ))}
          </div>
          {errors.classDays && (
            <p className="text-red-500 text-xs mt-1">{errors.classDays}</p>
          )}
        </div>

        {/* Timezone */}
        <div className="flex flex-col justify-start">
          <label className="text-xs text-gray-500 mb-1 text-start">Timezone</label>
          <Select
            value={form.timezone || undefined}
            onValueChange={(val) => handleChange("timezone", val)}
          >
            <SelectTrigger className="border rounded-md h-10 w-full">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timezone && (
            <p className="text-red-500 text-xs mt-1">{errors.timezone}</p>
          )}
        </div>

        {/* Preferred Start Date */}
        <div className="flex flex-col justify-start">
          <label className="text-start text-xs text-gray-500 mb-1">
            Preferred Start Date
          </label>
          <Select
            value={form.preferredStartDate || undefined}
            onValueChange={(val) => handleChange("preferredStartDate", val)}
          >
            <SelectTrigger className="border rounded-md h-10 w-full">
              <SelectValue placeholder="Select date" />
            </SelectTrigger>
            <SelectContent>
              {generateAvailableDates().map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.preferredStartDate && (
            <p className="text-red-500 text-xs mt-1">{errors.preferredStartDate}</p>
          )}
        </div>

        {/* Preferred Start Time */}
        <div className="flex flex-col justify-start">
          <label className="text-xs text-gray-500 mb-1 text-start">
            Preferred Start Time
          </label>
          <Select
            value={form.preferredStartTime || undefined}
            onValueChange={(val) => handleChange("preferredStartTime", val)}
          >
            <SelectTrigger className="border rounded-md h-10 w-full">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {generateTimeSlots().map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.preferredStartTime && (
            <p className="text-red-500 text-xs mt-1">{errors.preferredStartTime}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col justify-start">
          <label className="text-xs text-gray-500 mb-1 text-start">Password</label>
          <input
            type="password"
            value={form.password}
            placeholder="password"
            onChange={(e) => handleChange("password", e.target.value)}
            className="border rounded-md h-10 px-3 w-full"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col justify-start">
          <label className="text-xs text-gray-500 mb-1 text-start">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            placeholder="confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded-md h-10 px-3 w-full"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Registering..." : "Register"}
        </Button>
      </div>
    </form>
  );
}
