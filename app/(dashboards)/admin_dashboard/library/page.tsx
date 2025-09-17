'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import BooksInfo from '@/components/pages/Admin-Dashboard/library/BooksInfo';
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
    <div className="">
      <h1 className="text-2xl font-bold mb-6">Manage Books</h1>


      {loading && (
        <div className="rounded-md border border-border bg-background mt-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <th key={i} className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-[70%] bg-muted" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-border">
                    {Array.from({ length: 6 }).map((_, colIndex) => (
                      <td key={colIndex} className="px-4 py-3">
                        <Skeleton className="h-4 w-[70%] bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
