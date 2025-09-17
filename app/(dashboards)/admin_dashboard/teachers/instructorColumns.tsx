"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Loader2, Trash, TriangleAlert } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { useState } from "react";


export const instructorColumns = (
  handleEdit: (ins: any) => void,
  handleDelete: (id: string) => void,
  deletingId: string | null
): ColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: "Image",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img
          src={row.original.image}
          alt={row.original.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    ),
  },

  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "number",
    header: "Phone",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const ins = row.original;
      return (
        <div className="flex gap-2">
          {/* Edit */}
          <button
            onClick={() => handleEdit(ins)}
            className="p-1 text-primary hover:scale-105"
          >
            <Edit size={16} />
          </button>

          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="p-1 text-red-500 disabled:opacity-50"
                disabled={deletingId === ins._id}
              >
                {deletingId === ins._id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash size={16} />
                )}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex gap-2 items-center text-primary">
                  <TriangleAlert /> Are you sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Deleting this instructor may affect linked courses.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(ins._id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Confirm Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
