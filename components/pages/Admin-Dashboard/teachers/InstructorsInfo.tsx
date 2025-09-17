

"use client";

import { useState } from "react";
import EditInstructorForm from "./EditInstructorForm";
import { instructorColumns } from "@/app/(dashboards)/admin_dashboard/teachers/instructorColumns";
import { DataTable } from "@/components/global/data-table";


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


interface InstructorsInfoProps {
  instructors: Instructor[];
  onUpdate: () => void;
}

export default function InstructorsInfo({
  instructors,
  onUpdate,
}: InstructorsInfoProps) {
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/db/instructors/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete instructor");
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6">
      <DataTable
        columns={instructorColumns(
          (ins) => setEditingInstructor(ins),
          handleDelete,
          deletingId
        )}
        data={instructors}
        searchPlaceholder="Search instructors..."
      />

      {editingInstructor && (
        <EditInstructorForm
          instructor={editingInstructor}
          onClose={() => setEditingInstructor(null)}
          onSuccess={() => {
            setEditingInstructor(null);
            onUpdate();
          }}
        />
      )}
    </div>
  );
}
