'use client';



export interface Instructor {
  _id: string;
  userId: string; // 🔑 link to users table
  name: string;
  designation: string;
  about: string;
  qualifications: string[];
  image: string;
  email?: string;
  number?: string;
  emergencyNumber : string,
  password?: string; // ⚠️ usually don’t expose this on frontend
  cloudinaryImageId?: string;
}



import { useState } from "react";
import { CircleX, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { validateImageFile } from "@/lib/validation";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = "Quran_Academy";

interface EditInstructorFormProps {
  instructor: Instructor;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditInstructorForm({
  instructor,
  onClose,
  onSuccess,
}: EditInstructorFormProps) {
  const [form, setForm] = useState({
    name: instructor.name,
    designation: instructor.designation,
    about: instructor.about,
    qualifications: instructor.qualifications.join("\n"),
    image: instructor.image,
    cloudinaryImageId: instructor.cloudinaryImageId,
    email: instructor.email || "",
    number: instructor.number || "",
    emergencyNumber: instructor.emergencyNumber || "",
    password: instructor.password || "",
    userId: instructor.userId || "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(instructor.image || null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validationError = validateImageFile(selectedFile);
    if (validationError) {
      toast.error("Invalid file");
      setFile(null);
      setPreview(instructor.image);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = form.image;
      let cloudId = form.cloudinaryImageId;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!uploadRes.ok) throw new Error("Image upload failed.");

        const imgData = await uploadRes.json();
        imageUrl = imgData.secure_url;
        cloudId = imgData.public_id;
      }

      const qualificationsArray = form.qualifications
        .split("\n")
        .map((q) => q.trim())
        .filter((q) => q.length > 0);

      const res = await fetch(`/api/db/instructors/${instructor._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          qualifications: qualificationsArray,
          image: imageUrl,
          cloudinaryImageId: cloudId,
        }),
      });

      if (!res.ok) throw new Error("Failed to update instructor.");

      toast.success("Instructor updated successfully!");
      onSuccess();
    } catch (err: unknown) {
      console.error("🔥 Error updating instructor:", err);
      toast.error("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed px-6 inset-0 bg-[#020000af] flex items-center justify-center">
      <div className="rounded-lg overflow-hidden relative w-full max-w-4xl">
        <CircleX
          className="absolute top-2 right-5 bg-gray-500 hover:scale-110 text-white rounded-full w-[28px] h-[28px]"
          onClick={onClose}
        />
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#122031] p-6 rounded-lg shadow-lg space-y-4 overflow-x-hidden md:max-h-[95vh] max-h-[90vh] overflow-y-auto"
        >
          <h2 className="text-lg font-semibold mb-4">Edit Instructor</h2>

          {/* 2-col grid on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-xs text-gray-500">Instructor Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Designation */}
            <div>
              <label className="text-xs text-gray-500">Designation</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-gray-500">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Number */}
            <div>
              <label className="text-xs text-gray-500">Phone Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
              />
            </div>

            {/* Emergency Number */}
            <div>
              <label className="text-xs text-gray-500">Emergency Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={form.emergencyNumber}
                onChange={(e) => setForm({ ...form, emergencyNumber: e.target.value })}
              />
            </div>

            {/* UserId (readonly) */}
            <div>
              <label className="text-xs text-gray-500">User ID</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={form.userId}
                readOnly
              />
            </div>

            {/* Password (readonly) */}
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500">Password</label>
              <input
                type="text"
                className="w-full p-2 border rounded "
                value={form.password}
                readOnly
              />
            </div>
          </div>

          {/* About */}
          <div>
            <label className="text-xs text-gray-500">About</label>
            <textarea
              className="w-full p-2 border rounded min-h-[100px]"
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
              required
            />
          </div>

          {/* Qualifications */}
          <div>
            <label className="text-xs text-gray-500">Qualifications (One Per Line)</label>
            <textarea
              className="w-full p-2 border rounded min-h-[80px]"
              value={form.qualifications}
              onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-xs text-gray-500">Change Instructor Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-accent text-black rounded hover:bg-accent-hover disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
