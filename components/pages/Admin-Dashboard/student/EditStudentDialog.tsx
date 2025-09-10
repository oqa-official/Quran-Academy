"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Course } from "@/lib/types/courses";
import { toast } from "sonner";

export default function EditStudentDialog({ student, open, onClose, onSaved }: any) {
  const [form, setForm] = useState(student || {});
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (student) setForm(student);
  }, [student]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("/api/db/courses");
      console.log("courses res", res);
      if (res.ok) setCourses(await res.json());
      console.log("response status",res.ok)
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
    }
    else {
      throw new Error("Failed to update student");
    }
   } catch (error) {
    toast.error("Failed to update student");
    onClose();
   }
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-1">
          <Input value={form.name || ""} onChange={(e) => handleChange("name", e.target.value)} placeholder="Name" />
          <Input value={form.email || ""} onChange={(e) => handleChange("email", e.target.value)} placeholder="Email" />
          <Input value={form.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} placeholder="Phone" />
          <Input type="number" value={form.age || ""} onChange={(e) => handleChange("age", Number(e.target.value))} placeholder="Age" />
          <Input type="number" value={form.price || ""} onChange={(e) => handleChange("price", Number(e.target.value))} placeholder="Price" />

          {/* Status */}
          <Select  value={form.status} onValueChange={(val) => handleChange("status", val)} >
            <SelectTrigger  className="w-full"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
            </SelectContent>
          </Select>

            {/* Course */}
          <Select value={form.course?._id || ""} onValueChange={(val) => handleChange("course", val)}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select course" /></SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c._id} value={c._id ? c._id : ""} >{c.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ClassDays */}
          <div className="flex flex-wrap gap-2 col-span-2">
            {days.map((d) => (
              <label key={d} className="flex items-center gap-1">
                <Checkbox
                  checked={form.classDays?.includes(d)}
                  onCheckedChange={(checked) => {
                    if (checked) handleChange("classDays", [...(form.classDays || []), d]);
                    else handleChange("classDays", form.classDays.filter((x: string) => x !== d));
                  }}
                />
                <span>{d}</span>
              </label>
            ))}
          </div>

        
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
