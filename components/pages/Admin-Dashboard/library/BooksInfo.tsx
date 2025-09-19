"use client";

import { useState } from "react";
import { Loader2, Trash, Edit, TriangleAlert, Pencil } from "lucide-react";
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
import { ColumnDef } from "@tanstack/react-table";
import EditBookForm from "./EditBookForm";
import { DataTable } from "@/components/global/data-table";

interface Book {
  _id: string;
  name: string;
  author: string;
  coverImage: string;
  pdfUrl: string;
  description?: string;
  category?: string;
}

export default function BooksInfo({
  books,
  onUpdate,
}: {
  books: Book[];
  onUpdate: () => void;
}) {
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/db/books/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete book");
      }

      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ Define table columns
  const columns: ColumnDef<Book>[] = [
    {
      accessorKey: "coverImage",
      header: "Cover",
      cell: ({ row }) => (
        <img
          src={row.original.coverImage}
          alt={row.original.name}
          className="h-16 w-12 object-cover rounded-sm"
        />
      ),
    },
    {
      accessorKey: "name",
      enableGlobalFilter: true,
      header: "Name",
       cell: ({ row }) => {
        const value = row.getValue("name") as string;
        return value && value.length > 15 ? value.substring(0, 15) + "..." : value;
      },
    },
    {
      accessorKey: "author",
      enableGlobalFilter: true,
      header: "Author",
      cell: ({ row }) => {
        const value = row.getValue("author") as string;
        return value && value.length > 15 ? value.substring(0, 15) + "..." : value;
      },
    },
    {
      accessorKey: "category",
      enableGlobalFilter: true,
      header: "Category",
      cell: ({ row }) => row.original.category || "Uncategorized",
    },
    {
      accessorKey: "pdfUrl",
      header: "PDF",
      cell: ({ row }) => (
        <a
          href={row.original.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#b3a02353] dark:text-primary text-xs p-1 rounded-[5px] hover:underline"
        >
          Open Link
        </a>
      ),
    }
    ,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const book = row.original;
        return (
          <div className="flex gap-2 items-center ">
           <div className="p-2 bg-[#ffffff4a] rounded-md">
             <Pencil size={18}
              onClick={() => setEditingBook(book)}
              className=" text-accent hover:scale-110 transition-transform cursor-pointer"
            />
           </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="rounded disabled:opacity-50 flex items-center bg-[#6b0b0b67] p-2 rounded-md"
                  disabled={deletingId === book._id}
                >
                  {deletingId === book._id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1" /> Deleting...
                    </>
                  ) : (
                    <Trash size={18} className="text-red-500 hover:scale-110 transition-transform cursor-pointer" />
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex gap-3 items-center text-primary">
                    <TriangleAlert /> Confirm Delete?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Deleting this book will remove its cover & PDF as well. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deletingId === book._id}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(book._id)}
                    disabled={deletingId === book._id}
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

  return (
    <div className="mt-4">
      <DataTable
        columns={columns}
        data={books}
        searchPlaceholder="Search books..."
      />

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSuccess={() => {
            setEditingBook(null);
            onUpdate();
          }}
        />
      )}
    </div>
  );
}
