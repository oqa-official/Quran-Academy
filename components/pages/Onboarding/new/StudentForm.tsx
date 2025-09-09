"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateAvailableDates, generateTimeSlots, TIMEZONES } from "@/lib/constants/timezones";
import { PhoneInput } from "react-international-phone";
import { toast } from "sonner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface StudentFormProps {
  index: number;
  data: any;
  onChange: (newData: any) => void;
  basePrice: number;
}

export default function StudentForm({ index, data, onChange, basePrice }: StudentFormProps) {
  const handle = (name: string, value: string | number) =>
    onChange({ ...data, [name]: value });

  // 🟢 Handle frequency + price
  const handleFrequency = (val: string) => {
    const freq = parseInt(val);
    let price = basePrice;
    if (freq === 3) price += 10;
    if (freq === 4) price += 20;
    if (freq === 5) price += 25;
    onChange({ ...data, frequency: freq, price });
  };

  // 🟢 Toggle days
  const toggleDay = (day: string) => {
    let selected = data.classDays || [];
    if (selected.includes(day)) {
      selected = selected.filter((d: string) => d !== day);
    } else {
      if (selected.length < (data.frequency || 2)) {
        selected = [...selected, day];
      } else {
        toast.error(`You can only select ${data.frequency || 2} days per week`)
        return;
      }
    }
    onChange({ ...data, classDays: selected });
  };

  return (
    <div className="p-4 border rounded-xl shadow-sm">



      {/* Responsive grid: 1 col on mobile, 2 cols on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">Name</label>
          <input
            name="name"
            value={data.name || ""}
            placeholder="Full Name"
            onChange={(e) => handle("name", e.target.value)}
            className="border rounded-md h-10 px-3 w-full"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">Email</label>
          <input
            name="email"
            value={data.email || ""}
            placeholder="Email Address"
            onChange={(e) => handle("email", e.target.value)}
            className="border rounded-md h-10 px-3 w-full"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">Student's Number</label>
          <input
            name="phone"
            value={data.phone || ""}
            placeholder="Phone Number"
            onChange={(e) => handle("phone", e.target.value)}
            className="border rounded-md h-10 px-3 w-full"
          />
         
        </div>

        {/* Age */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">Age</label>
          <input
            name="age"
            type="number"
            min={3}
            max={100}
            value={data.age || ""}
            placeholder="Enter correct age"
            onChange={(e) => handle("age", e.target.value)}
            className="border rounded-md h-10 px-3 w-full"
          />
        </div>

        {/* Frequency */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">
            Classes/week (Basic Quran Learning)
          </label>
          <Select
            onValueChange={handleFrequency}
            value={data.frequency ? String(data.frequency) : undefined}
          >
            <SelectTrigger className="border rounded-md h-10 w-full">
              <SelectValue placeholder="Select classes per week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Classes/week (${basePrice})</SelectItem>
              <SelectItem value="3">3 Classes/week (${basePrice + 10})</SelectItem>
              <SelectItem value="4">4 Classes/week (${basePrice + 20})</SelectItem>
              <SelectItem value="5">5 Classes/week (${basePrice + 25})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Auto Price */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">Fee/Month in $</label>
          <input
            name="price"
            value={data.price || ""}
            readOnly
            placeholder="$"
            className="border rounded-md h-10 px-3 w-full bg-gray-100"
          />
        </div>

        {/* Days */}
        <div className="flex flex-col w-full md:col-span-1">
          <label className="text-xs text-start text-gray-500 mb-1">Select Days</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                type="button"
                key={day}
                onClick={() => toggleDay(day)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border transition ${data.classDays?.includes(day)
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300"
                  }`}
              >
                {day[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Timezone */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">Timezone</label>
          <Select
            value={data.timezone || undefined}
            onValueChange={(val) => handle("timezone", val)}
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
        </div>

        {/* Preferred Start Date */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">Preferred Start Date</label>
          <Select
            value={data.preferredStartDate || undefined}
            onValueChange={(val) => handle("preferredStartDate", val)}
          >
            <SelectTrigger className="border rounded-md h-10 w-full">
              <SelectValue placeholder="Select start date" />
            </SelectTrigger>
            <SelectContent>
              {generateAvailableDates().map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Preferred Start Time */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">Preferred Start Time</label>
          <Select
            value={data.preferredStartTime || undefined}
            onValueChange={(val) => handle("preferredStartTime", val)}
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
        </div>
      </div>
    </div>
  );
}
