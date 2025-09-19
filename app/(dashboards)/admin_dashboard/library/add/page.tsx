'use client';

import { useEffect, useState } from 'react';
import { toast } from "sonner";
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
    <div className="">

      {/* Add New Book */}
      <AddBook onSuccess={fetchBooks} />

    </div>
  );
}
