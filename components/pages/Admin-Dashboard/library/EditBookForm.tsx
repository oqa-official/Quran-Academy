
"use client";

import { useState } from "react";
import { CircleX, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

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

    const [cover, setCover] = useState<File | null>(null);
    const [pdf, setPdf] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(book.coverImage);
    const [loading, setLoading] = useState(false);

    // ✅ Upload to Cloudinary
    const uploadFile = async (file: File, resourceType: "image" | "raw") => {
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

    // ✅ Handle form submit
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
            onSuccess();
        } catch (err: any) {
            toast.error(err.message || "Update failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#00000069] flex items-center justify-center z-50">
           <div className="rounded-lg overflow-hidden relative">
             <form
                onSubmit={handleSubmit}
                className="bg-white  p-6 rounded-lg shadow-lg md:w-4xl max-sm:max-w-[300px] space-y-3 overflow-x-hidden md:max-h-[95vh] max-h-[90vh]"
            >
                <CircleX className="absolute top-2 right-5 bg-gray-500 hover:scale-110 text-white rounded-full w-[28px] h-[28px]" onClick={onClose}/>
                <h2 className="text-lg font-semibold mb-2">Edit Book</h2>

                <label className="text-xs text-gray-500">Book Name</label>
                <input
                    type="text"
                    placeholder="Book Name"
                    required
                    className="w-full p-2 border rounded"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <label className="text-xs text-gray-500">Book Author</label>
                <input
                    type="text"
                    placeholder="Author"
                    required
                    className="w-full p-2 border rounded"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                />

                <label className="text-xs text-gray-500">Book Description</label>
                <textarea
                    placeholder="Description"
                    className="w-full p-2 border rounded min-h-[80px]"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <label className="text-xs text-gray-500">Book Category</label>
                <input
                    type="text"
                    placeholder="Category"
                    className="w-full p-2 border rounded"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                />

                <div>
                    <label className="text-sm font-medium">Change Cover</label>

                    <div className="flex justify-start items-center gap-2 w-full p-2 border rounded ">
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
                        className="w-32 h-32 object-cover rounded-md"
                    />
                )}

                <div className="flex flex-col">
                    <a href={form.pdfUrl} className="text-sm font-medium text-accent underline" target="_blank">Current PDF Link</a>
                    <label className="text-sm font-medium">Replace PDF</label>

                    <div className="flex justify-start items-center gap-2 w-full p-2 border rounded ">
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



                <div className="flex justify-end gap-2 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white flex items-center justify-center disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Save"}
                    </button>
                </div>
            </form>
           </div>
        </div>
    );
}
