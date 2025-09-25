'use client';

import AddInstructor from '@/components/pages/(dashboards)/Admin-Dashboard/teachers/AddInstructor';
import InstructorsInfo from '@/components/pages/(dashboards)/Admin-Dashboard/teachers/InstructorsInfo';
import { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Instructor {
  _id: string;
  userId : string,
  name: string;
  designation: string;
  about: string;
  qualifications: string[];
  image: string;
  email?: string;
  number?: string;
  emergencyNumber : string
}

export default function TeachersPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstructors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/db/instructors');

      if (!res.ok) {
        throw new Error("Failed to fetch instructors.");
      }

      const data: Instructor[] = await res.json();

      if (!data || data.length === 0) {
        setInstructors([]);
        setError("No instructors found.");
        return;
      }
      setInstructors(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while fetching instructors.");
      toast.error(err.message || "Unable to load instructors."); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">Manage Instructors</h1>

    
      {loading && (
        <div className="rounded-md border border-border bg-background mt-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <th key={i} className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-[70%] bg-muted" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-border">
                    {Array.from({ length: 6 }).map((_, colIndex) => (
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

      {/* Error / Empty State */}
      {!loading && !error && (
        <p className="text-red-500 text-center">{error}</p>
      )}

      {/* Instructors */}
      {!loading && !error && instructors.length > 0 && (
        <InstructorsInfo instructors={instructors} onUpdate={fetchInstructors} />
      )}
    </div>
  );
}
