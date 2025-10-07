

import React from "react";
import { PhoneInput } from "react-international-phone";
import Turnstile from "react-turnstile";
import { toast } from "sonner";

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  errors: any;
}

const PersonalVerificationStep: React.FC<Props> = ({ formData, setFormData, errors }) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  // ✅ Handle file validation (only images up to 5 MB)
  const handleFileChange = (field: string, file: File | null) => {
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only Images are allowed");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 5 MB.");
        return;
      }
    }

    setFormData({
      ...formData,
      files: { ...formData.files, [field]: file },
    });
  };

  // ✅ Preview for images
  const renderPreview = (file: File | null) => {
    if (!file) return null;

    const blobUrl = URL.createObjectURL(file);
    return (
      <img
        src={blobUrl}
        alt="preview"
        className="mt-2 h-24 w-auto object-cover border rounded"
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className="block mb-2 text-gray-700">Full Name</label>
        <input
          type="text"
          className="w-full border rounded-lg p-3"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Phone */}

      <div className="flex flex-col w-full md:col-span-1">
        <label className="block mb-2 text-gray-700">
          Whatsapp&apos;s Number
        </label>
        <PhoneInput
          defaultCountry="us"
          preferredCountries={["us", "gb", "ca", "au"]}
          value={formData.phone || ""}
          onChange={(value) => setFormData({ ...formData, phone: value })}
          inputClassName="w-full border rounded-sm p-2 bg-transparent"
          className="bg-transparent h-10"
        />

      </div>

      {/* Email */}
      <div>
        <label className="block mb-2 text-gray-700">Email</label>
        <input
          type="email"
          className="w-full border rounded-lg p-3"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* File Uploads with Preview */}
      <div>
        <label className="block mb-2 text-gray-700">Personal Identity card (Front side)</label>
        <input
          type="file"
          accept="image/*"
          className="w-full border rounded-lg p-2 text-gray-400"
          onChange={(e) => handleFileChange("idFront", e.target.files?.[0] || null)}
        />
        {renderPreview(formData.files.idFront)}
        {errors.idFront && <p className="text-red-500 text-sm">{errors.idFront}</p>}
      </div>

      <div>
        <label className="block mb-2 text-gray-700">Personal Identity card (Back side)</label>
        <input
          type="file"
          accept="image/*"
          className="w-full border rounded-lg p-2 text-gray-400"
          onChange={(e) => handleFileChange("idBack", e.target.files?.[0] || null)}
        />
        {renderPreview(formData.files.idBack)}
        {errors.idBack && <p className="text-red-500 text-sm">{errors.idBack}</p>}
      </div>

      <div>
        <label className="block mb-2 text-gray-700">Quranic Certificate</label>
        <input
          type="file"
          accept="image/*"
          className="w-full border rounded-lg p-2 text-gray-400"
          onChange={(e) => handleFileChange("quranCert", e.target.files?.[0] || null)}
        />
        {renderPreview(formData.files.quranCert)}
        {errors.quranCert && <p className="text-red-500 text-sm">{errors.quranCert}</p>}
      </div>

      <div>
        <label className="block mb-2 text-gray-700">Last Educational Certificate</label>
        <input
          type="file"
          accept="image/*"
          className="w-full border rounded-lg p-2 text-gray-400"
          onChange={(e) => handleFileChange("educationCert", e.target.files?.[0] || null)}
        />
        {renderPreview(formData.files.educationCert)}
        {errors.educationCert && <p className="text-red-500 text-sm">{errors.educationCert}</p>}
      </div>

      {/* Captcha */}
      <div className="mt-4 flex flex-col justify-center">
        <Turnstile
          theme="light"
          sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onVerify={() => setFormData({ ...formData, captcha: true })}
          onError={() => setFormData({ ...formData, captcha: false })}
          onExpire={() => setFormData({ ...formData, captcha: false })}
        />
        {errors.captcha && <p className="text-red-500 text-sm -mt-1 text-start">{errors.captcha}</p>}
      </div>

    </div>
  );
};

export default PersonalVerificationStep;
