'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import BooksInfo from '@/components/pages/(dashboards)/Admin-Dashboard/library/BooksInfo';
import { Book } from '@/lib/types/books';
import LoadingSkeleton from '@/components/pages/(dashboards)/Admin-Dashboard/loading/loadingSkeleton';



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
    <div className="">
      <h1 className="text-2xl font-bold mb-6">Manage Books</h1>


      {loading && (
        <LoadingSkeleton/>
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
