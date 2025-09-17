'use client';

import { useState, useRef } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = "Quran_Academy";

export default function AddBook({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: "",
    author: "",
    description: "",
    category: "",
  });

  const [cover, setCover] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCover(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdf(file);
  };

  const uploadFile = async (file: File, resourceType: "image" | "raw" | "auto") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) throw new Error("Upload failed.");
    return res.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cover || !pdf) {
      toast.error("Please upload both cover image and PDF.");
      return;
    }

    setLoading(true);
    try {
      const coverData = await uploadFile(cover, "image");
      const pdfData = await uploadFile(pdf, "auto");

      const res = await fetch("/api/db/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          coverImage: coverData.secure_url,
          cloudinaryImageId: coverData.public_id,
          pdfUrl: pdfData.secure_url,
          cloudinaryPdfId: pdfData.public_id,
        }),
      });

      if (!res.ok) throw new Error("Failed to add book.");

      toast.success("Book added successfully!");

      // reset form
      setForm({ name: "", author: "", description: "", category: "" });
      setCover(null);
      setPdf(null);
      setPreview(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
      if (pdfInputRef.current) pdfInputRef.current.value = "";

      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Error adding book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        Add New Book
      </h2>

      <input
        type="text"
        placeholder="Book Name"
        required
        className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="text"
        placeholder="Author"
        required
        className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        value={form.author}
        onChange={(e) => setForm({ ...form, author: e.target.value })}
      />

      <textarea
        placeholder="Description"
        className="w-full p-2 border rounded min-h-[80px] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="text"
        placeholder="Category"
        className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <div>
        <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">
          Upload Cover Image
        </label>
        <div className="flex items-center gap-2 mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600">
          <UploadCloud className="text-gray-500 dark:text-gray-400" />
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            ref={coverInputRef}
            className="text-sm text-gray-700 dark:text-gray-300"
          />
        </div>
      </div>

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-32 h-32 rounded-md object-cover border border-gray-300 dark:border-gray-600"
        />
      )}

      <div>
        <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">
          Upload PDF
        </label>
        <div className="flex items-center gap-2 mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600">
          <UploadCloud className="text-gray-500 dark:text-gray-400" />
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            ref={pdfInputRef}
            className="text-sm text-gray-700 dark:text-gray-300"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Adding..." : "Add Book"}
      </button>
    </form>
  );
}
