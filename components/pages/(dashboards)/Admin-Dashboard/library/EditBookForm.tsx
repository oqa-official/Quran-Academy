'use client';

import { useEffect, useState } from "react";
import { CircleX, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useDirtyForm } from "@/context/DirtyFormContext";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = "Quran_Academy";

interface Book {
  _id: string;
  name: string;
  author: string;
  coverImage: string;
  pdfUrl: string;
  cloudinaryImageId?: string;
  cloudinaryPdfId?: string;
  description?: string;
  category?: string;
}

export default function EditBookForm({
  book,
  onClose,
  onSuccess,
}: {
  book: Book;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: book.name,
    author: book.author,
    description: book.description || "",
    category: book.category || "",
    coverImage: book.coverImage,
    pdfUrl: book.pdfUrl,
    cloudinaryImageId: book.cloudinaryImageId,
    cloudinaryPdfId: book.cloudinaryPdfId,
  });

  const { setDirty } = useDirtyForm();

  const [cover, setCover] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(book.coverImage);
  const [loading, setLoading] = useState(false);

  // Track dirty state
  useEffect(() => {
    const hasChanges =
      form.name !== book.name ||
      form.author !== book.author ||
      form.description !== (book.description || "") ||
      form.category !== (book.category || "") ||
      cover !== null ||
      pdf !== null;
    setDirty(hasChanges);
  }, [form, cover, pdf, book, setDirty]);

  const uploadFile = async (file: File, resourceType: "image" | "raw") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "library");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) throw new Error("Upload failed.");
    return res.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let newCover = form.coverImage;
      let newPdf = form.pdfUrl;
      let imgId = form.cloudinaryImageId;
      let pdfId = form.cloudinaryPdfId;

      if (cover) {
        const coverData = await uploadFile(cover, "image");
        newCover = coverData.secure_url;
        imgId = coverData.public_id;
      }

      if (pdf) {
        const pdfData = await uploadFile(pdf, "raw");
        newPdf = pdfData.secure_url;
        pdfId = pdfData.public_id;
      }

      const res = await fetch(`/api/db/books/${book._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          coverImage: newCover,
          pdfUrl: newPdf,
          cloudinaryImageId: imgId,
          cloudinaryPdfId: pdfId,
        }),
      });

      if (!res.ok) throw new Error("Failed to update book.");

      toast.success("Book updated successfully!");

      // reset dirty state
      setDirty(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[99] max-md:px-3">
      <div className="rounded-md overflow-hidden w-full max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#122031] text-foreground p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto relative"
        >
          {/* Close button */}
          <CircleX
            className="absolute top-3 right-3 cursor-pointer text-muted-foreground hover:text-foreground w-7 h-7"
            onClick={onClose}
          />

          <h2 className="text-lg font-semibold mb-4">Edit Book</h2>

          <label className="text-xs text-muted-foreground">Book Name</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded dark:bg-[#122031] text-foreground mb-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label className="text-xs text-muted-foreground">Author</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded dark:bg-[#122031] text-foreground mb-2"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />

          <label className="text-xs text-muted-foreground">Description</label>
          <textarea
            className="w-full p-2 border rounded dark:bg-[#122031] text-foreground min-h-[80px] mb-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <label className="text-xs text-muted-foreground">Category</label>
          <input
            type="text"
            className="w-full p-2 border rounded dark:bg-[#122031] text-foreground mb-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          {/* Change Cover */}
          <div className="mt-3">
            <label className="text-sm font-medium">Change Cover</label>
            <div className="flex items-center gap-2 w-full p-2 border rounded">
              <UploadCloud />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setCover(f);
                    setPreview(URL.createObjectURL(f));
                  }
                }}
                className="mt-1 block w-full text-sm"
              />
            </div>
          </div>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md mt-2"
            />
          )}

          {/* Replace PDF */}
          <div className="mt-3">
            <a
              href={form.pdfUrl}
              className="text-sm font-medium text-accent underline"
              target="_blank"
            >
              Current PDF Link
            </a>
            <label className="text-sm font-medium block mt-1">Replace PDF</label>
            <div className="flex items-center gap-2 w-full p-2 border rounded">
              <UploadCloud />
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setPdf(f);
                }}
                className="mt-1 block w-full text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-accent text-white flex items-center justify-center hover:bg-accent/80 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
