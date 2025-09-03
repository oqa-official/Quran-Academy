"use client";

import { TextAnimate } from "@/components/magicui/text-animate";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { ChevronRight, Search, AlertCircle, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Book } from "@/lib/types/books";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";



const FreeBooks: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const booksPerPage = 8;

    // Fetch books from API
    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/db/books");
            if (!res.ok) throw new Error("Failed to fetch books.");
            const data: Book[] = await res.json();

            setBooks(data);
            console.log("Fetched books:", data[0]);

            // Extract unique categories (filter out undefined/empty)
            const uniqueCategories = Array.from(
                new Set(
                    data
                        .map((b) => b.category?.trim()) // handle optional + remove extra spaces
                        .filter((cat): cat is string => !!cat) // keep only non-empty
                )
            );

            setCategories(["All", ...uniqueCategories]);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchBooks();
    }, []);

    // Filter books by search + category
    const filteredBooks = books.filter((book) => {
        const matchesSearch = book?.name
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesCategory =
            selectedCategory === "All" || book.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Pagination
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const startIndex = (page - 1) * booksPerPage;
    const displayedBooks = filteredBooks.slice(
        startIndex,
        startIndex + booksPerPage
    );

    return (
        <section className="py-16 container">
            <div className="flex flex-col justify-between items-center">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    <img
                        src="/assets/home/verse.png"
                        alt="Quran verse"
                        className="mx-auto mb-6 max-h-[80px]"
                    />
                </motion.div>

                <TextAnimate
                    animation="blurIn"
                    by="word"
                    duration={0.6}
                    as="h2"
                    className="text-2xl md:text-3xl -mt-3 font-bold mb-2 text-primary"
                >
                    Books From Our Library
                </TextAnimate>

                <img
                    src="/assets/home/arrow.png"
                    alt="arrow"
                    className="w-[200px] text-center mx-auto mb-2"
                />
            </div>

            {/* Search + Category */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center border border-primary rounded-md px-2 w-full sm:w-full">
                    <Search />
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 rounded-lg outline-none border-none"
                    />
                </div>

                <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                        setSelectedCategory(value);
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="w-full sm:w-[30%] py-5 border-[1px] border-primary rounded-md">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem
                                key={cat}
                                value={cat}
                                className={`cursor-pointer my-1 ${selectedCategory === cat ? "bg-accent text-black" : ""
                                    }`}
                            >
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Loading */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: booksPerPage }).map((_, i) => (
                        <div key={i} className="space-y-3 flex flex-col justify-start items-start">
                            <Skeleton className="h-72 w-full rounded-md bg-primary" />
                            <Skeleton className="h-6 w-3/4  bg-primary" />
                            <Skeleton className="h-4 w-1/2  bg-primary" />
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="text-center text-red-600 flex flex-col items-center gap-2">
                    <AlertCircle className="w-6 h-6" />
                    <p>{error}</p>
                    <button
                        onClick={fetchBooks}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Retry
                    </button>
                </div>
            )}

            {/* Grid */}
            {!loading && !error && (
                <>
                    {displayedBooks.length === 0 ? (
                        <h5 className="text-center text-gray-600 text-xl min-h-[40vh] bg-white flex justify-center items-center rounded-lg shadow-md">
                            No results found.
                        </h5>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {displayedBooks.map((book) => (
                                <div
                                    key={book._id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden group hover:scale-105 transition-transform duration-300"
                                >
                                    <div className="relative">
                                        <img
                                            src={book.coverImage}
                                            alt={book.name}
                                            className="w-full h-72 object-cover object-bottom"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                            <a href={book.pdfUrl} target="_blank" className="bg-accent text-black px-4 py-2 rounded-md flex items-center space-x-2">
                                                <span>Read Now</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="p-4 text-start">
                                        <h3 className="font-semibold text-xl text-primary">{book.name}</h3>
                                        <p className="text-accent-hover text-sm">By {book.author}</p>
                                        <p className="text-gray-500 text-sm">By  {book.description
                                            ? book.description.split(" ").slice(0, 10).join(" ") +
                                            (book.description.split(" ").length > 10 ? "..." : "")
                                            : "No description available"}</p>
                                        <span className="text-sm text-accent font-medium mt-2 block">
                                            Free
                                        </span>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-4 py-2 rounded-md border ${page === i + 1
                                ? "bg-primary text-white"
                                : "bg-white text-gray-700"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
};

export default FreeBooks;
