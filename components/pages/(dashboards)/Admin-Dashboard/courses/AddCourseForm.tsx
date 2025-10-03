
"use client";
import { Course } from "@/lib/types/courses";
import { Instructor } from "@/lib/types/instructor";
import { Loader, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDirtyForm } from "@/context/DirtyFormContext"; // ✅ import

interface AddCourseFormProps {
  onSuccess?: () => void | Promise<void>;
}

export default function AddCourseForm({ onSuccess }: AddCourseFormProps) {
  const [form, setForm] = useState<Partial<Course>>({
    overview: {
      summary: "",
      whatYouLearn: "",
      whoFor: "",
      requirements: "",
      certification: "",
    },
  });
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setDirty } = useDirtyForm(); // ✅ hook

  // ✅ Mark dirty if any field has value
  useEffect(() => {
    setDirty(
      !!form.title ||
      !!form.duration ||
      !!form.price ||
      !!form.instructor ||
      !!form.overview?.summary ||
      !!form.overview?.whatYouLearn ||
      !!form.overview?.whoFor ||
      !!form.overview?.requirements ||
      !!form.overview?.certification ||
      selectedImage !== null
    );
  }, [form, selectedImage, setDirty]);

  // ✅ Fetch instructors
  useEffect(() => {
    async function fetchInstructors() {
      try {
        const res = await fetch("/api/db/instructors");
        if (!res.ok) throw new Error("Failed to fetch instructors");
        const data = await res.json();
        setInstructors(data);
      } catch (err: any) {
        setError(err.message || "Failed to load instructors");
      }
    }
    fetchInstructors();
  }, []);

  const handleInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (
      ["summary", "whatYouLearn", "whoFor", "requirements", "certification"].includes(
        name
      )
    ) {
      setForm((prev) => ({
        ...prev,
        overview: { ...prev.overview!, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Quran_Academy");
    data.append("folder", "course");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    if (!res.ok) throw new Error("Image upload failed");
    return res.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!form.instructor) {
        setError("Please select an instructor before submitting.");
        setLoading(false);
        return;
      }

      let imageUrl = "";
      let cloudinaryId = "";

      if (selectedImage) {
        const uploadRes = await uploadToCloudinary(selectedImage);
        imageUrl = uploadRes.secure_url;
        cloudinaryId = uploadRes.public_id;
      }

      const payload: Partial<Course> = {
        ...form,
        image: imageUrl,
        cloudinaryImageId: cloudinaryId,
        curriculum: [],
        reviews: [],
      };

      const res = await fetch("/api/db/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add course");

      // reset form
      setForm({
        overview: {
          summary: "",
          whatYouLearn: "",
          whoFor: "",
          requirements: "",
          certification: "",
        },
      });
      setSelectedImage(null);
      setPreviewUrl(null);

      setDirty(false); // ✅ reset dirty

      if (onSuccess) await onSuccess();
      toast.success("New Course Added Successfully");
      router.push("/admin_dashboard/courses");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full bg-gray-50 dark:bg-[#122031] p-4 rounded-md"
    >
      {/* Course Title */}
      <div>
        <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">Course Title*</p>
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          className="border p-2 w-full"
          value={form.title || ""}
          onChange={handleInput}
          required
        />
      </div>

      {/* Course Duration */}
      <div>
        <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">Course Duration*</p>
        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g. 6 weeks)"
          className="border p-2 w-full"
          value={form.duration || ""}
          onChange={handleInput}
          required
        />
      </div>

      {/* Price */}
      <div>
        <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">Price ($)*</p>
        <input
          type="number"
          name="price"
          placeholder="Price"
          className="border p-2 w-full"
          value={form.price || ""}
          onChange={handleInput}
          required
        />
      </div>

      {/* Instructor */}
      <div>
        <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">Select Instructor*</p>
        <select
          name="instructor"
          value={form.instructor || ""}
          onChange={handleInput}
          className="border p-2 w-full dark:bg-[#122031]"
          required
        >
          <option value="">Select Instructor</option>
          {instructors.map((inst) => (
            <option key={inst._id} value={inst._id}>
              {inst.name}
            </option>
          ))}
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">Course Banner Image*</p>
        <div className="flex justify-start items-center gap-2 w-full p-2 border rounded">
          <UploadCloud />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="h-32 mt-2 rounded" />
        )}
      </div>

      {/* Course Overview Section */}
      <div className="bg-white dark:bg-[#091b30] rounded-md p-5 space-y-3">
        {/* Section Header */}
        <p className="ms-1 my-1 font-semibold text-gray-700 dark:text-gray-300">Course Overview Details</p>

        {/* Course Summary */}
        <div>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">Course Summary</p>
          <textarea
            name="summary"
            placeholder="Course Summary"
            className="border p-2 w-full"
            value={form.overview?.summary || ""}
            onChange={handleInput}
          />
        </div>

        {/* What You'll Learn */}
        <div>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">What You'll Learn</p>
          <textarea
            name="whatYouLearn"
            placeholder="What You'll Learn"
            className="border p-2 w-full"
            value={form.overview?.whatYouLearn || ""}
            onChange={handleInput}
          />
        </div>

        {/* Who is this course for? */}
        <div>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">Who is this course for?</p>
          <textarea
            name="whoFor"
            placeholder="Who is this course for?"
            className="border p-2 w-full"
            value={form.overview?.whoFor || ""}
            onChange={handleInput}
          />
        </div>

        {/* Requirements */}
        <div>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">Requirements</p>
          <textarea
            name="requirements"
            placeholder="Requirements"
            className="border p-2 w-full"
            value={form.overview?.requirements || ""}
            onChange={handleInput}
          />
        </div>

        {/* Certification Details */}
        <div>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">Certification Details</p>
          <textarea
            name="certification"
            placeholder="Certification Details"
            className="border p-2 w-full"
            value={form.overview?.certification || ""}
            onChange={handleInput}
          />
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="disabled:bg-gray-200 disabled:cursor-not-allowed bg-accent w-full max-w-[200px] ms-auto hover:bg-accent-hover flex justify-center text-white px-4 py-2 rounded-md"
      >
        {loading ? (
          <Loader className="animate-spin text-black text-center flex justify-center" />
        ) : (
          "Add Course"
        )}
      </button>
    </form>
  );
}




