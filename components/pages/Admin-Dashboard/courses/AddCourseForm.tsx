"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Course } from "@/lib/types/courses";
import { Instructor } from "@/lib/types/instructor";
import { Loader, UploadCloud } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// ✅ Define props type
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        curriculum: [], // not added yet
        reviews: [],
      };

      const res = await fetch("/api/db/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // ✅ important
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add course");

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

      // ✅ Call parent refresh function
      if (onSuccess) await onSuccess();
      toast.success("New Course Added Succssfully")

    } catch (err: any) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Something went wrong")
    } finally {
      setLoading(false);
    }
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="w-full text-lg bg-gray-100 my-2 p-3 shadow-md">Add New Course</AccordionTrigger>
        <AccordionContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 w-full bg-gray-100 p-4 shadow rounded-md"
          >

            <input
              type="text"
              name="title"
              placeholder="Course Title"
              className="border p-2 w-full"
              value={form.title || ""}
              onChange={handleInput}
              required
            />

            <input
              type="text"
              name="duration"
              placeholder="Duration (e.g. 6 weeks)"
              className="border p-2 w-full"
              value={form.duration || ""}
              onChange={handleInput}
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              className="border p-2 w-full"
              value={form.price || ""}
              onChange={handleInput}
              required
            />

            <select
              name="instructor"
              value={form.instructor || ""}
              onChange={handleInput}
              className="border p-2 w-full"
              required
            >
              <option value="">Select Instructor</option>
              {instructors.map((inst) => (
                <option key={inst._id} value={inst._id}>
                  {inst.name}
                </option>
              ))}
            </select>

            <label className="ms-1 text-gray-400">Choose Course Banner Image</label>
            <div className="flex justify-start items-center gap-2 w-full p-2 border rounded ">
              <UploadCloud />
              <input
                type="file"
                placeholder="Upload Image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="h-32 mt-2 rounded" />
            )}

            <div className="bg-white rounded-md p-5">
              <p className="ms-1 my-1">Course Overview</p>
              <textarea
                name="summary"
                placeholder="Course Summary"
                className="border p-2 w-full"
                value={form.overview?.summary || ""}
                onChange={handleInput}
              />

              <textarea
                name="whatYouLearn"
                placeholder="What You'll Learn"
                className="border p-2 w-full"
                value={form.overview?.whatYouLearn || ""}
                onChange={handleInput}
              />

              <textarea
                name="whoFor"
                placeholder="Who is this course for?"
                className="border p-2 w-full"
                value={form.overview?.whoFor || ""}
                onChange={handleInput}
              />

              <textarea
                name="requirements"
                placeholder="Requirements"
                className="border p-2 w-full"
                value={form.overview?.requirements || ""}
                onChange={handleInput}
              />

              <textarea
                name="certification"
                placeholder="Certification Details"
                className="border p-2 w-full"
                value={form.overview?.certification || ""}
                onChange={handleInput}
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}



            <button
              type="submit"
              disabled={loading}
              className={`disabled:bg-gray-200 disabled:cursor-not-allowed bg-accent w-full hover:bg-accent-hover flex justify-center text-white px-4 py-2 rounded-md`}
            >
              {loading ? <Loader className="animate-spin text-black text-center flex justify-center" /> : "Add Course"}
            </button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
