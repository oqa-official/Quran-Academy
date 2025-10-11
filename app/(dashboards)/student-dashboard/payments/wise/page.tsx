"use client";

import { useStudentData } from "@/components/pages/(dashboards)/Student-Dashboard/StudentDataProvider";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  UploadCloud,
  AlertCircle,
  XCircle,
  CalendarDays,
  DollarSignIcon,
  BanknoteArrowUp,
  BanknoteArrowUpIcon,
} from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { toast } from "sonner";
import WisePaymentCard from "./WisePaymentCard";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = "Quran_Academy";

export default function WisePaymentSection() {
  const { parentInquiry, totalFee, students, loading } = useStudentData() as {
    students: any[];
    totalFee: number;
    loading: boolean;
    parentInquiry: {
      _id: string;
      dueDate?: string | null;
      extendedDueDate?: string | null; // ignored by logic
    } | null;
  };

  const [latestPayment, setLatestPayment] = useState<{
    wiseStatus?: string; // "pending" | "approved" | "rejected" | undefined
    wiseScreenshot?: string;
    amount?: number;
    approvedAt?: string;
  } | null>(null);

  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // -------------------------
  // DATE logic (ONLY dueDate)
  // -------------------------
  const today = new Date();
  const dueDate = useMemo(() => {
    return parentInquiry?.dueDate ? new Date(parentInquiry.dueDate) : null;
  }, [parentInquiry?.dueDate]);

  // If no dueDate provided -> treat as "due passed" (we need to collect)
  const isDuePassed = useMemo(() => {
    if (!dueDate) return true; // no due date => prompt for payment
    return today > dueDate;
  }, [dueDate]);

  // -------------------------
  // Fetch latest Wise payment
  // -------------------------
  const fetchWisePayment = async () => {
    if (!parentInquiry?._id) {
      console.warn("⚠️ fetchWisePayment: no parentInquiry._id");
      setLatestPayment(null);
      return;
    }
    try {
      const res = await fetch(`/api/payment/wise?inquiryId=${parentInquiry._id}`);
      const data = await res.json();

      if (!res.ok) {
        console.error("❌ fetchWisePayment failed:", data);
        setLatestPayment(null);
        return;
      }

      // data is expected to be one object: { wiseStatus, wiseScreenshot, amount, approvedAt }
      setLatestPayment(data);
    } catch (err) {
      console.error("🔥 fetchWisePayment error:", err);
      setLatestPayment(null);
    }
  };

  useEffect(() => {
    if (parentInquiry?._id) fetchWisePayment();
  }, [parentInquiry?._id]);

  // -------------------------
  // File handling & upload
  // -------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("File size exceeds 1MB. Please upload less than 1MB.");
      e.target.value = "";
      return;
    }

    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const compressImage = async (file: File) => {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const scale = Math.min(1, 800 / bitmap.width);
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return new Promise<File>((resolve) =>
      canvas.toBlob(
        (blob) => resolve(new File([blob!], file.name, { type: "image/jpeg" })),
        "image/jpeg",
        0.75
      )
    );
  };

  const uploadToCloudinary = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    fd.append("folder", "wise_payments");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: fd,
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error("❌ cloudinary upload failed:", res.status, txt);
      throw new Error("Cloudinary upload failed");
    }
    const json = await res.json();
    return json;
  };

  // -------------------------
  // submit
  // -------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentInquiry?._id) return toast.error("Inquiry not found.");
    if (!screenshot) return toast.error("Please upload a screenshot.");

    setUploading(true);

    try {
      const compressed = await compressImage(screenshot);

      const uploaded = await uploadToCloudinary(compressed);

      const payload = {
        inquiry: parentInquiry._id,
        amount: totalFee,
        screenshotUrl: uploaded.secure_url,
        cloudinaryPublicId: uploaded.public_id,
      };

      const res = await fetch("/api/payment/wise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Submission failed");

      toast.success("Payment screenshot submitted!");
      setScreenshot(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await fetchWisePayment();
    } catch (err: any) {
      console.error("🔥 submit error:", err);
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // -------------------------
  // render decisions
  // -------------------------
  const wiseStatus = latestPayment?.wiseStatus; // "pending" | "approved" | "rejected" | undefined
  const wiseScreenshot = latestPayment?.wiseScreenshot;

  const showNextDue = Boolean(dueDate && !isDuePassed);
  const showPendingNotification = isDuePassed && wiseStatus === "pending" && Boolean(wiseScreenshot);
  // show the form when due has passed AND NOT pending (pending blocks the form)
  const showForm = isDuePassed && wiseStatus !== "pending";

  if (loading) return <p className="text-center py-6">Loading payment info...</p>;
  if (!parentInquiry || students.length === 0)
    return <p className="text-center py-6 text-red-500">No students found for this inquiry.</p>;

  return (
    <div className="space-y-4">
      {/* Students table + total fee (merged, smaller font) */}
      <div className="rounded-lg border bg-white dark:bg-[#122031] shadow p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-3 py-1.5 border">Name</th>
                <th className="px-3 py-1.5 border">Educational Email</th>
                <th className="px-3 py-1.5 border">User ID</th>
                <th className="px-3 py-1.5 border">Status</th>
                <th className="px-3 py-1.5 border text-right">Fee</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-t dark:border-gray-700">
                  <td className="px-3 py-1.5">{s.name}</td>
                  <td className="px-3 py-1.5">{s.educationMail}</td>
                  <td className="px-3 py-1.5">{s.userId}</td>
                  <td className="px-3 py-1.5 capitalize">{s.status}</td>
                  <td className="px-3 py-1.5 text-right font-medium">${s.price}</td>
                </tr>
              ))}

              <tr className="bg-gray-50 dark:bg-gray-900 font-semibold">
                <td colSpan={4} className="px-3 py-2 text-right text-accent font-merriweather">
                  Total Fee
                </td>
                <td className="px-3 py-2 text-right text-accent text-lg font-merriweather">
                  ${totalFee}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Wise Payment block */}
      <div className="bg-white dark:bg-[#122031] border p-4 rounded-md shadow space-y-3">
        <p className="text-base text-accent font-medium flex gap-2 justify-start items-center"><BanknoteArrowUpIcon/> Wise Payment</p>

        {/* 1) If due not passed → ONLY show next due date */}
        {showNextDue && dueDate && (
          <div className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 p-3 rounded-md flex items-center gap-2 text-sm">
            <CalendarDays className="w-4 h-4" />
            <p>
              Your next due date is{" "}
              <span className="font-medium text-black dark:text-accent">
                {dueDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
              .
            </p>
          </div>
        )}

        {/* 2) If due passed & there's a pending submission → show pending ONLY (no form) */}
        {showPendingNotification && (
          <div className="bg-gray-100 dark:bg-gray-950 text-yellow-700 dark:text-gray-50 p-3 rounded-md text-sm flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <p>Your payment screenshot has been submitted and is under review.</p>
            </div>
            <img src={wiseScreenshot} alt="Wise screenshot (pending)" className="w-48 h-48 object-cover rounded-md border" />
            <p className="text-xs">We'll notify you when reviewed.</p>
          </div>
        )}

        {/* 3) If due passed & not pending → show form (for rejected, approved, or no payment).
               For rejected, show rejection notice above the form.  */}
        {showForm && (
          <>
            {wiseStatus === "rejected" && wiseScreenshot && (
              <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded-md text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                <p>Your previous Wise payment was rejected. Please upload a new screenshot.</p>
              </div>
            )}
            <div className="flex flex-col-reverse md:gap-10 md:flex-row-reverse w-full justify-between items-start">

              <div className="md:w-[50%]">
                <WisePaymentCard />
              </div>

            <form onSubmit={handleSubmit} className="rounded-xl p-5 shadow-md space-y-3 mt-4 bg-gray-100 dark:bg-[#0e1b1f] h-full  w-full md:max-w-[50%]">
              <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-accent" />
                Upload your Wise payment screenshot below (max size 1 MB).
              </p>

              <div className="flex items-center gap-2 mt-2 p-2 border rounded bg-gray-50 dark:bg-gray-800">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="text-sm"
                  required
                />
              </div>

              {preview && (
                <img src={preview} alt="Preview" className="w-48 h-48 rounded-md object-cover border" />
              )}

              <Button
                type="submit"
                disabled={uploading}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-md disabled:opacity-60"
              >
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                {uploading ? "Submitting..." : "Submit Screenshot"}
              </Button>
            </form>
                        </div>

          </>
        )}
      </div>
    </div>
  );
}
