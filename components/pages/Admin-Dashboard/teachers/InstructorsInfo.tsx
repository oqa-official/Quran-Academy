





'use client';

import { useState } from 'react';
import EditInstructorForm from './EditInstructorForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Delete, Edit, Loader2, Trash, TriangleAlert } from 'lucide-react';


export interface Instructor {
  _id: string;
  userId: string; // 🔑 link to users table
  name: string;
  designation: string;
  about: string;
  qualifications: string[];
  image: string;
  email?: string;
  number?: string;
  emergencyNumber : string,
  password?: string; // ⚠️ usually don’t expose this on frontend
  cloudinaryImageId?: string;
}



interface InstructorsInfoProps {
  instructors: Instructor[];
  onUpdate: () => void;
}

export default function InstructorsInfo({ instructors, onUpdate }: InstructorsInfoProps) {
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setError(null);

      const res = await fetch(`/api/db/instructors/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete instructor');
      }

      onUpdate();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {instructors.map((ins) => (
        <div
          key={ins._id}
          className="bg-gray-100 shadow-lg shadow-gray-400 rounded-lg p-4 flex flex-col items-start text-center"
        >
          {/* Profile Image + Info */}
          <div className="flex flex-row gap-2">
            <img
              src={ins.image}
              alt={ins.name}
              className="w-20 h-20 max-h-28 max-w-28 rounded-full object-cover shadow-md shadow-gray-500"
            />

            <div className="mt-4">
              <h2 className="text-xl text-start font-semibold capitalize">{ins.name}</h2>
              <p className="text-sm text-start text-gray-500">{ins.designation}</p>
            </div>
          </div>

  
          {/* Action Buttons */}
          <div className="flex justify-end w-full  space-x-0 -mt-6">
            <button
              onClick={() => setEditingInstructor(ins)}
              className="p-1 py-1 hover:scale-105 text-primary rounded"
            >
              <Edit/>
            </button>

            {/* Delete with AlertDialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="p-1 py-1 text-red-500 rounded disabled:opacity-50 flex items-center"
                  disabled={deletingId === ins._id}
                >
                  {deletingId === ins._id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1" /> Deleting...
                    </>
                  ) : (
                    <Trash className=''/>
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className='flex gap-3 items-center text-primary'> <TriangleAlert className='' />Are you fully sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Deleting this instructor may impact courses where this instructor is currently assigned.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deletingId === ins._id}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(ins._id)}
                    disabled={deletingId === ins._id}
                    className='bg-red-600 hover:bg-red-700'
                  >
                    Confirm Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Error Display */}
          {error && deletingId === ins._id && (
            <p className="text-red-500 text-xs mt-2">{error}</p>
          )}
        </div>
      ))}

      {/* Popup Form for Editing */}
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
