'use client';

import AddInstructor from '@/components/pages/Admin-Dashboard/teachers/AddInstructor';
import InstructorsInfo from '@/components/pages/Admin-Dashboard/teachers/InstructorsInfo';
import { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Instructor {
  _id: string;
  name: string;
  designation: string;
  about: string;
  qualifications: string[];
  image: string;
  email?: string;
  phone?: string;
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
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Manage Instructors</h1>

      {/* Add New Instructor */}
      <AddInstructor onSuccess={fetchInstructors} />

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3 max-w-[350px] gap-0 flex flex-col justify-start items-start">
              <Skeleton className="h-48 w-full rounded-md bg-primary"/>
              <Skeleton className="h-10 w-full  bg-primary" />
              <Skeleton className="h-4 w-[75%] bg-primary" />
              <Skeleton className="h-4 w-[50%] bg-primary"/>
            </div>
          ))}
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
