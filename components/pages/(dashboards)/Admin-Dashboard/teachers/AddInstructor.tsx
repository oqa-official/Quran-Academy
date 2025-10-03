'use client';

import { useState, useEffect } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { InstructorForm } from "@/lib/types/instructor";
import { validateImageFile } from "@/lib/validation";
import { useDirtyForm } from "@/context/DirtyFormContext";
// Import validation utility from the phone library
import { PhoneInput } from "react-international-phone";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import { useRouter } from "next/navigation";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = "Quran_Academy";

// 1. Define the default country code for the dirty check
const DEFAULT_COUNTRY_CODE = "+44"; // Matches defaultCountry="gb" in PhoneInput

export default function AddInstructor({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<InstructorForm>({
    name: "",
    designation: "",
    about: "",
    qualifications: "",
    email: "",
    number: "", // This will become "+44" shortly after render
    emergencyNumber: "", // This will also become "+44" shortly after render
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🟢 dirty form context
  const { setDirty } = useDirtyForm();

  // mark dirty whenever form changes
  useEffect(() => {
    // Check if any *non-phone* field is dirty
    const otherFieldsDirty = [
      form.name,
      form.designation,
      form.about,
      form.qualifications,
      form.email,
    ].some((val) => val.trim() !== "");

    // Check if the phone fields are dirty (i.e., not just the default country code)
    const phoneFieldsDirty =
      (form.number !== "" && form.number !== DEFAULT_COUNTRY_CODE) ||
      (form.emergencyNumber !== "" && form.emergencyNumber !== DEFAULT_COUNTRY_CODE);

    // The form is dirty if any other field is filled, a file is selected, or a phone field has
    // more than just the default country code.
    const isFormDirty = otherFieldsDirty || phoneFieldsDirty || file !== null;

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

    // --- ⭐ NEW PHONE VALIDATION LOGIC ⭐ ---

    // 1. Check if numbers are valid (not just a country code)
    const isNumberValid = form.number.length > DEFAULT_COUNTRY_CODE.length && isPossiblePhoneNumber(form.number);
    const isEmergencyNumberValid = form.emergencyNumber.length > DEFAULT_COUNTRY_CODE.length && isPossiblePhoneNumber(form.emergencyNumber);

    // The form requires both numbers, so we check if they are invalid and toast an error.
    if (!isNumberValid) {
        toast.error("Please enter a valid Phone Number.");
        return;
    }
    
    if (!isEmergencyNumberValid) {
        toast.error("Please enter a valid Emergency Contact Number.");
        return;
    }

    // 2. Check for duplicate numbers
    if (form.number === form.emergencyNumber) {
      toast.error("The Phone Number and Emergency Number must be different.");
      return;
    }
    // --- ⭐ END NEW PHONE VALIDATION LOGIC ⭐ ---


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

      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.error || "Failed to add instructor.");
      }

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
      router.push("/admin_dashboard/teachers")

      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (rest of the component JSX remains the same)
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-lg space-y-2 grid grid-cols-1 md:grid-cols-2 gap-1"
    >
       {/* Name */}
       <div>
         <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">Full Name*</p>
         <input
           type="text"
           placeholder="Name"
           required
           className="w-full p-2 border rounded"
           value={form.name}
           onChange={(e) => setForm({ ...form, name: e.target.value })}
         />
       </div>

       {/* Designation */}
       <div>
         <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">Designation*</p>
         <input
           type="text"
           placeholder="Designation"
           required
           className="w-full p-2 border rounded"
           value={form.designation}
           onChange={(e) => setForm({ ...form, designation: e.target.value })}
         />
       </div>

       {/* Email */}
       <div>
         <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">Email Address*</p>
         <input
           type="email"
           placeholder="Email"
           required
           className="w-full p-2 border rounded"
           value={form.email}
           onChange={(e) => setForm({ ...form, email: e.target.value })}
         />
       </div>

       {/* Number (PhoneInput) */}
       <div>
         <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">Phone Number*</p>
         <PhoneInput
           defaultCountry="gb"
           preferredCountries={["us", "gb", "ca", "au"]}
           value={form.number}
           required
           onChange={(phone) => setForm({ ...form, number: phone })}
           inputClassName="w-full p-2 rounded-sm bg-transparent outline-none! text-gray-900 dark:text-gray-300! dark:bg-transparent!"
           className="bg-transparent h-10 border border-none! dark:border-gray-700 dark:bg-transparent"
         />
       </div>

       {/* Emergency Contact (PhoneInput) */}
       <div>
         <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">Emergency Contact Number*</p>
         <PhoneInput
           defaultCountry="gb"
           preferredCountries={["us", "gb", "ca", "au"]}
           value={form.emergencyNumber}
           required
           onChange={(phone) => setForm({ ...form, emergencyNumber: phone })}
           inputClassName="w-full p-2 rounded-sm bg-transparent outline-none! text-gray-900 dark:text-gray-300! dark:bg-transparent!"
           className="bg-transparent h-10"
         />
       </div>

       {/* About */}
       <div className="md:col-span-2">
         <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">About (Bio)*</p>
         <textarea
           placeholder="About"
           required
           className="w-full p-2 border rounded min-h-[100px]"
           value={form.about}
           onChange={(e) => setForm({ ...form, about: e.target.value })}
         />
       </div>

       {/* Qualifications */}
       <div className="md:col-span-2">
         <p className="text-[10px] text-gray-600 dark:text-gray-400 ms-1">Qualifications (one per line)</p>
         <textarea
           placeholder="Qualifications (one per line)"
           className="w-full p-2 border rounded min-h-[100px]"
           value={form.qualifications}
           onChange={(e) =>
             setForm({ ...form, qualifications: e.target.value })
           }
         />
       </div>

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