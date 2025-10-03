// 'use client';

// import { useState, useRef, useEffect } from "react";
// import { Loader2, UploadCloud } from "lucide-react";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { useDirtyForm } from "@/context/DirtyFormContext";

// const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
// const UPLOAD_PRESET = "Quran_Academy";

// export default function AddBook({ onSuccess }: { onSuccess: () => void }) {
//   const [form, setForm] = useState({
//     name: "",
//     author: "",
//     description: "",
//     category: "",
//   });

//   const { setDirty } = useDirtyForm();
//   const [cover, setCover] = useState<File | null>(null);
//   const [pdf, setPdf] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const coverInputRef = useRef<HTMLInputElement | null>(null);
//   const pdfInputRef = useRef<HTMLInputElement | null>(null);
//   const router = useRouter();

//   // mark form as dirty on any change
//   useEffect(() => {
//     setDirty(
//       form.name !== "" ||
//       form.author !== "" ||
//       form.description !== "" ||
//       form.category !== "" ||
//       cover !== null ||
//       pdf !== null
//     );
//   }, [form, cover, pdf, setDirty]);

//   const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setCover(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setPdf(file);
//   };

//   const uploadFile = async (file: File, resourceType: "image" | "raw" | "auto") => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", UPLOAD_PRESET);
//     formData.append("folder", "library"); 

//     const res = await fetch(
//       `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
//       { method: "POST", body: formData }
//     );

//     if (!res.ok) throw new Error("Upload failed.");
//     return res.json();
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!cover || !pdf) {
//       toast.error("Please upload both cover image and PDF.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const coverData = await uploadFile(cover, "image");
//       const pdfData = await uploadFile(pdf, "auto");

//       const res = await fetch("/api/db/books", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...form,
//           coverImage: coverData.secure_url,
//           cloudinaryImageId: coverData.public_id,
//           pdfUrl: pdfData.secure_url,
//           cloudinaryPdfId: pdfData.public_id,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to add book.");

//       toast.success("Book added successfully!");

//       // reset form and dirty state
//       setForm({ name: "", author: "", description: "", category: "" });
//       setCover(null);
//       setPdf(null);
//       setPreview(null);
//       if (coverInputRef.current) coverInputRef.current.value = "";
//       if (pdfInputRef.current) pdfInputRef.current.value = "";
//       setDirty(false);

//       onSuccess();
//       router.push("/admin_dashboard/library");

//     } catch (err: any) {
//       toast.error(err.message || "Error adding book.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md space-y-4"
//     >
//       <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
//         Add New Book
//       </h2>

//       <input
//         type="text"
//         placeholder="Book Name"
//         required
//         className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
//         value={form.name}
//         onChange={(e) => setForm({ ...form, name: e.target.value })}
//       />

//       <input
//         type="text"
//         placeholder="Author"
//         required
//         className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
//         value={form.author}
//         onChange={(e) => setForm({ ...form, author: e.target.value })}
//       />

//       <textarea
//         placeholder="Description"
//         className="w-full p-2 border rounded min-h-[80px] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
//         value={form.description}
//         onChange={(e) => setForm({ ...form, description: e.target.value })}
//       />

//       <input
//         type="text"
//         placeholder="Category"
//         className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
//         value={form.category}
//         onChange={(e) => setForm({ ...form, category: e.target.value })}
//       />

//       <div>
//         <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">
//           Upload Cover Image
//         </label>
//         <div className="flex items-center gap-2 mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600">
//           <UploadCloud className="text-gray-500 dark:text-gray-400" />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleCoverChange}
//             ref={coverInputRef}
//             className="text-sm text-gray-700 dark:text-gray-300"
//             required
//           />
//         </div>
//       </div>

//       {preview && (
//         <img
//           src={preview}
//           alt="Preview"
//           className="w-32 h-32 rounded-md object-cover border border-gray-300 dark:border-gray-600"
//         />
//       )}

//       <div>
//         <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">
//           Upload PDF
//         </label>
//         <div className="flex items-center gap-2 mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600">
//           <UploadCloud className="text-gray-500 dark:text-gray-400" />
//           <input
//             type="file"
//             accept="application/pdf"
//             onChange={handlePdfChange}
//             ref={pdfInputRef}
//             className="text-sm text-gray-700 dark:text-gray-300"
//           />
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-60"
//       >
//         {loading && <Loader2 className="h-4 w-4 animate-spin" />}
//         {loading ? "Adding..." : "Add Book"}
//       </button>
//     </form>
//   );
// }










'use client';

import { useState, useRef, useEffect } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDirtyForm } from "@/context/DirtyFormContext";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = "Quran_Academy";

export default function AddBook({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: "",
    author: "",
    description: "",
    category: "",
  });

  const { setDirty } = useDirtyForm();
  const [cover, setCover] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // mark form as dirty on any change
  useEffect(() => {
    setDirty(
      form.name !== "" ||
      form.author !== "" ||
      form.description !== "" ||
      form.category !== "" ||
      cover !== null ||
      pdf !== null
    );
  }, [form, cover, pdf, setDirty]);

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

    // --- ⭐ REQUIRED FIELD CHECK ⭐ ---
    if (!form.name.trim()) {
      toast.error("Book Name is required.");
      return;
    }
    if (!form.author.trim()) {
      toast.error("Author is required.");
      return;
    }
    // Description and Category are optional based on the original required tags, 
    // but if you want to make them required, uncomment the checks below:
    /*
    if (!form.description.trim()) {
      toast.error("Description is required.");
      return;
    }
    if (!form.category.trim()) {
      toast.error("Category is required.");
      return;
    }
    */
    
    if (!cover) {
      toast.error("Cover image is required.");
      return;
    }
    if (!pdf) {
      toast.error("PDF file is required.");
      return;
    }
    // --- ⭐ END REQUIRED FIELD CHECK ⭐ ---


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

      // reset form and dirty state
      setForm({ name: "", author: "", description: "", category: "" });
      setCover(null);
      setPdf(null);
      setPreview(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      setDirty(false);

      onSuccess();
      router.push("/admin_dashboard/library");

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

      {/* Book Name */}
      <div>
        <label htmlFor="bookName" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
          Book Name*
        </label>
        <input
          id="bookName"
          type="text"
          placeholder="Book Name"
          required
          className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 mt-1"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* Author */}
      <div>
        <label htmlFor="author" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
          Author*
        </label>
        <input
          id="author"
          type="text"
          placeholder="Author"
          required
          className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 mt-1"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Description"
          className="w-full p-2 border rounded min-h-[80px] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 mt-1"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
          Category*
        </label>
        <input
          id="category"
          type="text"
          placeholder="Category"
          className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 mt-1"
          value={form.category}
          required
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
      </div>

      {/* Cover Image Upload */}
      <div>
        <label htmlFor="coverFile" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
          Upload Cover Image*
        </label>
        <div className="flex items-center gap-2 mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600">
          <UploadCloud className="text-gray-500 dark:text-gray-400" />
          <input
            id="coverFile"
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            ref={coverInputRef}
            className="text-sm text-gray-700 dark:text-gray-300"
            required
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

      {/* PDF Upload */}
      <div>
        <label htmlFor="pdfFile" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
          Upload PDF*
        </label>
        <div className="flex items-center gap-2 mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600">
          <UploadCloud className="text-gray-500 dark:text-gray-400" />
          <input
            id="pdfFile"
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            ref={pdfInputRef}
            className="text-sm text-gray-700 dark:text-gray-300"
            required // Added required here for front-end visual check
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