'use client';

import { useState } from 'react';
import { Loader2, TriangleAlert } from 'lucide-react';
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
import EditBookForm from './EditBookForm';

interface Book {
  _id: string;
  name: string;
  author: string;
  coverImage: string;
  pdfUrl: string;
  description?: string;
  category?: string;
}

export default function BooksInfo({ books, onUpdate }: { books: Book[], onUpdate: () => void }) {
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/db/books/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete book');
      }

      onUpdate();
    } catch (err: any) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 mt-4">
      {books.map((book) => (
        <div
          key={book._id}
          className="bg-gray-100 shadow-lg rounded-lg p-4 flex flex-col items-start"
        >
          <img
            src={book.coverImage}
            alt={book.name}
            className="w-full max-h-[250px] object-cover rounded-md"
          />

          <h2 className="text-xl font-semibold mt-2">{book.name}</h2>
          <p className="text-sm text-gray-600">by {book.author}</p>
          <p className="text-sm text-gray-600 my-1">by  {book.description
            ? book.description.split(" ").slice(0, 10).join(" ") +
            (book.description.split(" ").length > 10 ? "..." : "")
            : "No description available"}</p>
          <p className="text-xs text-gray-500 font-semibold my-1"> {book.category || "Uncategorized"}</p>
          <a href={book.pdfUrl} className='text-xs text-accent underline'>PDF URL</a>

          <div className="flex justify-end w-full mt-6 space-x-2">
            <button
              onClick={() => setEditingBook(book)}
              className="px-3 py-1 bg-accent hover:bg-accent-hover text-black rounded"
            >
              Edit
            </button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50 flex items-center"
                  disabled={deletingId === book._id}
                >
                  {deletingId === book._id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1" /> Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className='flex gap-3 items-center text-primary'>
                    <TriangleAlert /> Confirm Delete?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Deleting this book will remove its cover & PDF as well. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deletingId === book._id}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(book._id)}
                    disabled={deletingId === book._id}
                    className='bg-red-600 hover:bg-red-700'
                  >
                    Confirm Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

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
      ))}
    </div>
  );
}
