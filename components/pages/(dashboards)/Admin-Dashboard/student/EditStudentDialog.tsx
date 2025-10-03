"use client";
import "./hideclose.css";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Course } from "@/lib/types/courses";
import { toast } from "sonner";
import TimezoneSelect from "react-timezone-select";
import { generateTimeSlots } from "@/lib/constants/timezones";
import { useTheme } from "next-themes";
import { PhoneInput } from "react-international-phone";

export default function EditStudentDialog({
  student,
  open,
  onClose,
  onSaved,
}: any) {
  const [form, setForm] = useState(student || {});
  const [courses, setCourses] = useState<Course[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    if (student) setForm(student);
  }, [student]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("/api/db/courses");
      if (res.ok) setCourses(await res.json());
    };
    fetchCourses();
  }, []);

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/db/students/${form._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        toast.success("Student updated successfully");
        onSaved(updated);
        onClose();
      } else {
        throw new Error("Failed to update student");
      }
    } catch (error) {
      toast.error("Failed to update student");
      onClose();
    }
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // ✅ custom styles for dark/light theme
  const timezoneStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#122031" : "white",
      color: theme === "dark" ? "white" : "black",
      borderColor: theme === "dark" ? "#2c3e50" : "#d1d5db",
      "&:hover": {
        borderColor: theme === "dark" ? "#3b82f6" : "#2563eb",
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#1a2a3d" : "white",
      color: theme === "dark" ? "white" : "black",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: theme === "dark" ? "white" : "black",
    }),
    input: (base: any) => ({
      ...base,
      color: theme === "dark" ? "white" : "black",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused
        ? theme === "dark"
          ? "#2c3e50"
          : "#e5e7eb"
        : "transparent",
      color: theme === "dark" ? "white" : "black",
    }),
  };

  return (
    <Dialog open={open} modal>
      <DialogHeader className="close_button_hidden">
        <DialogTitle>Edit Student</DialogTitle>
      </DialogHeader>

      <DialogContent className="max-w-lg dark:bg-[#122031] bg-white">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Name, Email, Phone, Price */}
          <div>
            <label className="text-xs text-start text-gray-500 mb-1">
              Name
            </label>
            <Input
              value={form.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Name"
            />
          </div>


          <div>
            <label className="text-xs text-start text-gray-500 mb-1">
              Email
            </label>
            <Input
              value={form.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Email"
            />
          </div>

          <div>
            <label className="text-xs text-start text-gray-500 mb-1">
              Number
            </label>

            <PhoneInput
              defaultCountry="gb"
              preferredCountries={["us", "gb", "ca", "au"]}
              value={form.phone}
              required
              onChange={(phone) => setForm({ ...form, phone: phone })}
              inputClassName="w-full p-2 rounded-sm bg-transparent outline-none! text-gray-900 dark:text-gray-300! dark:bg-transparent!"
              className="bg-transparent h-10 border border-none! dark:border-gray-700 dark:bg-transparent"
            />
          </div>

          <div>
            <label className="text-xs text-start text-gray-500 mb-1">
              Fee
            </label>
            <Input
              type="number"
              value={form.price || ""}
              onChange={(e) => handleChange("price", Number(e.target.value))}
              placeholder="Price"
            />
          </div>



          <div>

            <label className="text-xs text-start text-gray-500 mb-1">
              Status
            </label>
            {/* Status */}
            <Select
              value={form.status}
              onValueChange={(val) => handleChange("status", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="ongoing">On Going</SelectItem>
                <SelectItem value="onhold">On Hold</SelectItem>
                <SelectItem value="onleave">On Leave</SelectItem>
                <SelectItem value="quit">Quit</SelectItem>
              </SelectContent>
            </Select>

          </div>
          {/* Course */}

          <div>
            <label className="text-xs text-start text-gray-500 mb-1">
              Course
            </label>
            <Select
              value={form.course?._id || ""}
              onValueChange={(val) => {
                const selected = courses.find((c) => c._id === val);
                handleChange("course", selected); // store full object
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c._id} value={c._id ?? ""}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


          </div>
          {/* Timezone */}
          <div className="flex flex-col w-full col-span-2">
            <label className="text-xs text-start text-gray-500 mb-1">
              Timezone
            </label>
            <TimezoneSelect
              value={form.timezone || ""}
              onChange={(val) => handleChange("timezone", val.value)}
              styles={timezoneStyles}
              className="text-sm"
            />
          </div>

          {/* Preferred Start Time */}
          <div className="flex flex-col w-full col-span-2">
            <label className="text-xs text-start text-gray-500 mb-1">
              Preferred Start Time
            </label>
            <Select
              value={form.preferredStartTime || undefined}
              onValueChange={(val) => handleChange("preferredStartTime", val)}
            >
              <SelectTrigger className="border rounded-md h-10 w-full">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {generateTimeSlots().map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ClassDays */}
          <div className="flex flex-wrap gap-2 col-span-2">
            {days.map((d) => (
              <label key={d} className="flex items-center gap-1">
                <Checkbox
                  checked={form.classDays?.includes(d)}
                  onCheckedChange={(checked) => {
                    if (checked)
                      handleChange("classDays", [...(form.classDays || []), d]);
                    else
                      handleChange(
                        "classDays",
                        form.classDays.filter((x: string) => x !== d)
                      );
                  }}
                />
                <span>{d}</span>
              </label>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
