'use client';

import AddInstructor from '@/components/pages/Admin-Dashboard/teachers/AddInstructor';
import InstructorsInfo from '@/components/pages/Admin-Dashboard/teachers/InstructorsInfo';
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
    <div className="bg-white p-4 rounded-md shadow-lg dark:bg-[#122031]">
      <h1 className="text-2xl font-bold mb-6">Add Instructor</h1>

      {/* Add New Instructor */}
      <AddInstructor onSuccess={fetchInstructors} />
    </div>
  );
}
