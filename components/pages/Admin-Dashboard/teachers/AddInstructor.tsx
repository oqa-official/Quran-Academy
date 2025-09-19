'use client';

import { useState, useEffect } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { InstructorForm } from "@/lib/types/instructor";
import { validateImageFile } from "@/lib/validation";
import { useDirtyForm } from "@/context/DirtyFormContext";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = "Quran_Academy";

export default function AddInstructor({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<InstructorForm>({
    name: "",
    designation: "",
    about: "",
    qualifications: "",
    email: "",
    number: "",
    emergencyNumber: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🟢 dirty form context
  const { setDirty} = useDirtyForm();

  // mark dirty whenever form changes
  useEffect(() => {
    const isFormDirty =
      Object.values(form).some((val) => val.trim() !== "") || file !== null;
    setDirty(isFormDirty);
  }, [form, file, setDirty]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validationError = validateImageFile(selectedFile);
    if (validationError) {
      toast.error("Invalid file");
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Missing Image");
      return;
    }
    if (!CLOUD_NAME) {
      toast.error("Cloudinary is not configured");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "Teachers");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!uploadRes.ok) throw new Error("Image upload failed.");
      const imgData = await uploadRes.json();

      // 2. Format qualifications into array
      const qualificationsArray = form.qualifications
        .split("\n")
        .map((q) => q.trim())
        .filter((q) => q.length > 0);

      // 3. API call to save instructor
      const res = await fetch("/api/db/instructors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          qualifications: qualificationsArray,
          image: imgData.secure_url,
          cloudinaryImageId: imgData.public_id,
        }),
      });

      if (!res.ok) throw new Error("Failed to add instructor.");

      toast.success("Instructor added successfully!");

      // reset form
      setForm({
        name: "",
        designation: "",
        about: "",
        qualifications: "",
        email: "",
        number: "",
        emergencyNumber: "",
      });
      setFile(null);
      setPreview(null);

      // 🟢 reset dirty state after successful submit
      setDirty(false);

      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-lg space-y-2 grid grid-cols-1 md:grid-cols-2 gap-1"
    >
      {/* Name */}
      <input
        type="text"
        placeholder="Name"
        required
        className="w-full p-2 border rounded"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      {/* Designation */}
      <input
        type="text"
        placeholder="Designation"
        required
        className="w-full p-2 border rounded"
        value={form.designation}
        onChange={(e) => setForm({ ...form, designation: e.target.value })}
      />

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        required
        className="w-full p-2 border rounded"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {/* Number */}
      <input
        type="text"
        placeholder="Phone Number"
        required
        className="w-full p-2 border rounded"
        value={form.number}
        onChange={(e) => setForm({ ...form, number: e.target.value })}
      />

      {/* Emergency Contact */}
      <input
        type="text"
        placeholder="Emergency Contact Number"
        className="w-full p-2 border rounded md:col-span-2"
        value={form.emergencyNumber}
        onChange={(e) =>
          setForm({ ...form, emergencyNumber: e.target.value })
        }
      />

      {/* About */}
      <textarea
        placeholder="About"
        required
        className="w-full md:col-span-2 p-2 border rounded min-h-[100px]"
        value={form.about}
        onChange={(e) => setForm({ ...form, about: e.target.value })}
      />

      {/* Qualifications */}
      <textarea
        placeholder="Qualifications (one per line)"
        className="w-full p-2 border rounded min-h-[100px] md:col-span-2"
        value={form.qualifications}
        onChange={(e) =>
          setForm({ ...form, qualifications: e.target.value })
        }
      />

      {/* Image Upload */}
      <div className="flex flex-col justify-start gap-2 md:col-span-2">
        <label className="ms-1">Choose Instructor Image</label>
        <div className="flex justify-start items-center gap-2 w-full p-2 border rounded ">
          <UploadCloud />
          <input
            type="file"
            placeholder="Upload Image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {preview && (
        <div className="mt-2 md:col-span-2">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-md border"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="ms-auto flex items-center md:col-span-2 justify-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-black w-full max-w-[200px] rounded disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
