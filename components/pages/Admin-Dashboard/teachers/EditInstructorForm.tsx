// 'use client';
// import { useState } from 'react';

// export default function EditInstructorForm({ instructor, onClose, onSuccess }:any) {
//   const [form, setForm] = useState({ ...instructor });
//   const [file, setFile] = useState<File | null>(null);

//   const handleSubmit = async (e:any) => {
//     e.preventDefault();

//     let imageUrl = form.image;
//     let cloudId = form.cloudinaryImageId;

//     if (file) {
//       const formData = new FormData();
//       formData.append("file", file as Blob);
//       formData.append("upload_preset", "your_preset");

//       const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/<cloud_name>/image/upload`, {
//         method: "POST",
//         body: formData,
//       });
//       const imgData = await uploadRes.json();

//       imageUrl = imgData.secure_url;
//       cloudId = imgData.public_id;
//     }

//     const res = await fetch(`/api/db/instructors/${instructor._id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ ...form, image: imageUrl, cloudinaryImageId: cloudId }),
//     });

//     if (res.ok) {
//       alert("Instructor updated");
//       onSuccess();
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-lg font-semibold mb-4">Edit Instructor</h2>
//         <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 mb-2 border rounded" />
//         <input type="text" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="w-full p-2 mb-2 border rounded" />
//         <textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} className="w-full p-2 mb-2 border rounded" />
//         <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mb-2" />
//         <div className="flex justify-end gap-2">
//           <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 rounded">Cancel</button>
//           <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
//         </div>
//       </form>
//     </div>
//   );
// }









'use client';

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Instructor } from "@/lib/types/instructor"; // full instructor with _id, image, etc.
import { validateImageFile } from "@/lib/validation";

// Get env vars
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

      // Upload to Cloudinary if new file selected
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

      // Convert qualifications to array
      const qualificationsArray = form.qualifications
        .split("\n")
        .map((q) => q.trim())
        .filter((q) => q.length > 0);

      // PUT request
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

      toast.success("✅ Instructor updated successfully!");
      onSuccess();
    } catch (err: unknown) {
      console.error("🔥 Error updating instructor:", err);
      toast.error("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed px-6 inset-0 bg-[#020000af]  flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-3"
      >
        <h2 className="text-lg font-semibold mb-4">Edit Instructor</h2>

        <input
          type="text"
          placeholder="Name"
          required
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="text"
          placeholder="Designation"
          required
          className="w-full p-2 border rounded"
          value={form.designation}
          onChange={(e) => setForm({ ...form, designation: e.target.value })}
        />

        <textarea
          placeholder="About"
          required
          className="w-full p-2 border rounded min-h-[80px]"
          value={form.about}
          onChange={(e) => setForm({ ...form, about: e.target.value })}
        />

        <textarea
          placeholder="Qualifications (one per line)"
          className="w-full p-2 border rounded min-h-[80px]"
          value={form.qualifications}
          onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
        />

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
  );
}
