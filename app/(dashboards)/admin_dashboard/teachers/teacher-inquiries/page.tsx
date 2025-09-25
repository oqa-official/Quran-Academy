"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import TeacherInquiriesTable from "@/components/pages/(dashboards)/Admin-Dashboard/teachers/teacher-inquiries/TeacherInquiriesTable";

export interface TeacherInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  cnicFrontUrl : string,
}

export default function TeacherInquiriesPage() {
  const [inquiries, setInquiries] = useState<TeacherInquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 const fetchInquiries = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch("/api/db/teacher-inquiries");

    if (!res.ok) throw new Error("Failed to fetch teacher inquiries.");

    const json = await res.json();

    // ✅ unwrap the "data" field
    const data: TeacherInquiry[] = json.data;

    if (!data || data.length === 0) {
      setInquiries([]);
      setError("No teacher inquiries found.");
      return;
    }

    setInquiries(data);
  } catch (err: any) {
    console.error(err);
    setError(err.message || "An error occurred while fetching inquiries.");
    toast.error(err.message || "Unable to load teacher inquiries.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teacher Inquiries</h1>

      {loading && (
        <div className="rounded-md border border-border bg-background mt-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <th key={i} className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-[70%] bg-muted" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-border">
                    {Array.from({ length: 5 }).map((_, colIndex) => (
                      <td key={colIndex} className="px-4 py-3">
                        <Skeleton className="h-4 w-[70%] bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && inquiries.length > 0 && (
        <TeacherInquiriesTable inquiries={inquiries} onUpdate={fetchInquiries} />
      )}
    </div>
  );
}
