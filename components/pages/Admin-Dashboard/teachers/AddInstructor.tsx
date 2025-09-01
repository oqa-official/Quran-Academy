'use client';

import { useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { InstructorForm } from "@/lib/types/instructor";
import { validateImageFile } from "@/lib/validation";

// Get the environment variables
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = "Quran_Academy"; // Use the upload preset you created

export default function AddInstructor({ onSuccess }: { onSuccess: () => void }) {
    const [form, setForm] = useState<InstructorForm>({
        name: "",
        designation: "",
        about: "",
        qualifications: "",
    });

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        console.log("📂 Selected file:", selectedFile);

        if (!selectedFile) return;

        const validationError = validateImageFile(selectedFile);
        if (validationError) {
            console.error("❌ File validation error:", validationError);
            toast.error("Invalid file");
            setFile(null);
            setPreview(null);
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        console.log("✅ File set successfully:", selectedFile.name);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("🚀 Submitting form with data:", form);

        if (!file) {
            console.error("❌ No file selected");
            toast.error("Missing Image");
            return;
        }

        // Check if cloud name is available
        if (!CLOUD_NAME) {
            console.error("❌ Cloudinary cloud name is not set");
            toast.error("Cloudinary is not configured");
            return;
        }

        setLoading(true);

        try {
            // Upload image to Cloudinary using environment variable
            console.log("⬆️ Uploading image to Cloudinary...");
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", UPLOAD_PRESET);

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: "POST", body: formData }
            );

            console.log("📡 Cloudinary response status:", uploadRes.status);

            if (!uploadRes.ok) throw new Error("Image upload failed.");

            const imgData = await uploadRes.json();
            console.log("✅ Cloudinary upload success:", imgData);

            // Convert qualifications into array
            const qualificationsArray = form.qualifications
                .split("\n")
                .map((q) => q.trim())
                .filter((q) => q.length > 0);

            console.log("📋 Processed qualifications:", qualificationsArray);

            // API call to save instructor
            console.log("📡 Sending POST to /api/db/instructors...");
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

            console.log("📡 API response status:", res.status);

            if (!res.ok) throw new Error("Failed to add instructor.");

            toast.success("✅ Instructor added successfully!");
            console.log("🎉 Instructor saved in DB");

            setForm({ name: "", designation: "", about: "", qualifications: "" });
            setFile(null);
            setPreview(null);
            onSuccess();
        } catch (err: any) {
            console.error("🔥 Error during submit:", err);
            toast.error("Error, Something went wrong.");
        } finally {
            setLoading(false);
            console.log("⏹️ Submit process finished");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gray-100 p-6 rounded-lg shadow space-y-2"
        >
            <h2 className="text-lg font-semibold mb-4">Add Instructor</h2>

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
                className="w-full p-2 border rounded min-h-[100px]"
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
            />

            <textarea
                placeholder="Qualifications (one per line)"
                className="w-full p-2 border rounded min-h-[100px]"
                value={form.qualifications}
                onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
            />
           <div className="flex flex-col justify-start gao-2">
             <label className="ms-1">Choose Instructor Image</label>
            <div className="flex justify-start items-center gap-2 w-full p-2 border rounded ">
                <UploadCloud />
                <input type="file" placeholder="Upload Image" className="" accept="image/*" onChange={handleFileChange} />
            </div>
           </div>

            {preview && (
                <div className="mt-2">
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
                className="flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-black w-full rounded disabled:opacity-60"
            >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Adding..." : "Add"}
            </button>
        </form>
    );
}