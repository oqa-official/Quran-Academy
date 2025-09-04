'use client';

import { useState } from 'react';
import { Delete, Edit, Loader2, Trash, TriangleAlert } from 'lucide-react';
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
    <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-6 mt-4">
      {books.map((book) => (
        <div
          key={book._id}
          className="bg-gray-100 shadow-lg rounded-lg p-3 flex flex-col items-start"
        >
        <div className='flex justify-between w-full '>
            <img
            src={book.coverImage}
            alt={book.name}
            className="w-full max-w-36  max-h-36 object-cover rounded-md"
          />
          <div className="flex justify-center items-start  w-full space-x-2">
            <Edit 
              onClick={() => setEditingBook(book)}
              className="bg-accent text-white p-1 rounded-[2px] hover:scale-110 transition-transform cursor-pointer"
            >
              Edit
            </Edit>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className=" rounded disabled:opacity-50 flex items-center"
                  disabled={deletingId === book._id}
                >
                  {deletingId === book._id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1" /> Deleting...
                    </>
                  ) : (
                    <Trash className='bg-red-500 text-white p-1 rounded-[2px] hover:scale-110 transition-transform cursor-pointer'/>
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
        </div>

          <h2 className="text-lg font-semibold mt-2">{book.name}</h2>
          <p className="text-sm text-accent font-medium">By {book.author}</p>
         
          <p className="text-xs text-gray-500 font-semibold my-1">Category:  {book.category || "Uncategorized"}</p>
          <a href={book.pdfUrl} className='text-xs text-accent underline font-semibold'>PDF URL</a>

          

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
