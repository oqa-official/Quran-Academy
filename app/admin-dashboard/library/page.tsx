'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import BooksInfo from '@/components/pages/Admin-Dashboard/library/BooksInfo';
import AddBook from '@/components/pages/Admin-Dashboard/library/AddBook';
import { Book } from '@/lib/types/books';



export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/db/books');

      if (!res.ok) throw new Error("Failed to fetch books.");

      const data: Book[] = await res.json();

      if (!data || data.length === 0) {
        setBooks([]);
        setError("No books found.");
        return;
      }

      setBooks(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while fetching books.");
      toast.error(err.message || "Unable to load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Manage Books</h1>

      {/* Add New Book */}
      <AddBook onSuccess={fetchBooks} />

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3 max-w-[350px]">
              <Skeleton className="h-48 w-full rounded-md bg-primary"/>
              <Skeleton className="h-10 w-full bg-primary" />
              <Skeleton className="h-4 w-[75%] bg-primary" />
              <Skeleton className="h-4 w-[50%] bg-primary"/>
            </div>
          ))}
        </div>
      )}

      {/* Error / Empty State */}
      {!loading && error && (
        <p className="text-red-500 text-center">{error}</p>
      )}

      {/* Books */}
      {!loading && !error && books.length > 0 && (
        <BooksInfo books={books} onUpdate={fetchBooks} />
      )}
    </div>
  );
}
