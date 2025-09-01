"use client";
import { useState, useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import FormWrapper from "./FormWrapper";
import { TIMEZONES } from "@/lib/constants/timezones";

// ✅ helper: strips timezone offset so we only store calendar date
const normalizeDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export default function StepThree({ formData, setFormData, goNext, goBack }: any) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    formData.startDate ? normalizeDate(new Date(formData.startDate)) : undefined
  );
  const [timezone, setTimezone] = useState(formData.timezone || "");
  const [time, setTime] = useState(formData.startTime || "");
  const [loading, setLoading] = useState(false);

  // Generate dynamic 1-hour slots (9 AM → 9 PM)
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let h = 9; h <= 21; h++) {
      const hour = h % 12 === 0 ? 12 : h % 12;
      const suffix = h < 12 ? "AM" : "PM";
      slots.push(`${hour}:00 ${suffix}`);
    }
    return slots;
  }, []);

  // Rules for disabling dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextFourDays = new Date(today);
  nextFourDays.setDate(today.getDate() + 4);

  const disabledDates = [
    { from: new Date(0), to: today },
    { from: today, to: nextFourDays },
    { dayOfWeek: [0, 6] },
  ];



  const isDisabled = !selectedDate || !time || !timezone || loading;

  return (
    <FormWrapper
      title="Schedule Your Classes"
      verse="Pick a date and time for your free trial lesson"
      aayat="خَيْرُکُم مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"
      step={3}
      totalSteps={5}
      hideProgress={true}

    >
      <div className="flex flex-col md:flex-row gap-2">
        {/* Calendar */}
        <div className="rounded-xl shadow-sm p-4 w-full">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date);

                // Store exactly what user selected (local to them)
                setFormData((prev: any) => ({
                  ...prev,
                  startDate: date,  // keep raw Date object
                  startTime: "",
                  timezone: "",
                }));

                setTime("");
                setTimezone("");
              }
            }}

            disabled={disabledDates}
            classNames={{
              day_disabled: "rdp-day_disabled",
              day_selected: "rdp-day_selected",
              day_today: "rdp-day_today",
            }}
          />

        </div>

        <div className="flex flex-col gap-4 w-full">
          {/* Time Selection */}
          {selectedDate && (
            <div className="w-full">
              <Label className="mb-1 text-start">
                Select Time {selectedDate.toDateString()}
              </Label>
              <Select
                onValueChange={(value) => {
                  setTime(value);

                  // 👇 update formData
                  setFormData((prev: any) => ({
                    ...prev,
                    startTime: value,
                  }));
                }}
                value={time}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Timezone Selector */}
          {time && (
            <div className="w-full">
              <Label className="mb-1 text-start">Select Timezone</Label>
              <Select
                onValueChange={(value) => {
                  setTimezone(value);
                  // 👇 update formData
                  setFormData((prev: any) => ({
                    ...prev,
                    timezone: value,
                  }));
                }}
                value={timezone}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
          onClick={goBack}
          disabled={loading}
        >
          Back
        </button>

        <button
          type="button"
          disabled={!selectedDate && !time && !timezone}
          onClick={goNext}
          className={`${isDisabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-primary text-white hover:bg-accent"} px-4 py-2  rounded-md`}
        >
          Next
        </button>
      </div>
    </FormWrapper>
  );
}
