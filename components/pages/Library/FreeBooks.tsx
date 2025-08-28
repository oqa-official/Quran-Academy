"use client";
import { TextAnimate } from "@/components/magicui/text-animate";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { ChevronRight, Search } from "lucide-react"; // arrow icon

// Define Book type
interface Book {
    id: number;
    title: string;
    author: string;
    image: string;
}

const booksData: Book[] = [
    { id: 1, title: "Tajweed Rules of Quran", author: "Kareema Carol", image: "/assets/global/popup.png" },
    { id: 2, title: "Islamic Education", author: "Amin Shalhobo", image: "/assets/global/offer.png" },
    { id: 3, title: "Simple Rules of Tajweed", author: "Jamiatul Ulama", image: "/assets/global/popup.png" },
    { id: 4, title: "40 Hadith Chapter 1", author: "Shahih Bukhari", image: "/assets/global/popup.png" },
    { id: 5, title: "40 Hadith Chapter 2", author: "Shahih Bukhari", image: "/assets/global/offer.png" },
    { id: 6, title: "40 Rabbana Part 2", author: "OQA Publication", image: "/assets/global/popup.png" },
    { id: 7, title: "40 Rabbana Part 1", author: "OQA Publication", image: "/assets/global/offer.png" },
    { id: 8, title: "Fundamental Arabic Book", author: "OQA Publication", image: "/assets/global/popup.png" },
    { id: 9, title: "Fundamental Arabic Book", author: "OQA Publication", image: "/assets/global/offer.png" },
    { id: 10, title: "Fundamental Arabic Book", author: "OQA Publication", image: "/assets/global/popup.png" },
];

const FreeBooks: React.FC = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const booksPerPage = 8;

    // Filter books
    const filteredBooks = booksData.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const startIndex = (page - 1) * booksPerPage;
    const displayedBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

    return (
        <section className="py-16  container">
            <div className="">

               <div className="flex flex-col justify-between items-center">
                 <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true }} // run only first time in view
                >
                    <img
                        src="/assets/home/verse.png"
                        alt="Quran verse"
                        className="mx-auto mb-6 max-h-[80px]"
                    />
                </motion.div>

                  <TextAnimate animation="blurIn" by="word" duration={0.6} as="h2" className="text-2xl md:text-3xl -mt-3 font-bold mb-2 text-primary">
                        Books From Our Library
                    </TextAnimate>

                                        <img src="/assets/home/arrow.png" alt="Quran verse" className="w-[200px] text-center mx-auto mb-2" />
               </div>

                {/* Search Bar */}
                <div className="mb-8 flex justify-center items-center py-1 md:py-2 border-1 border-primary rounded-md px-2">
                    <Search />
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // reset to first page on search
                        }}
                        className="w-full px-4 py-2 border rounded-lg outline-none border-none"
                    />

                </div>

                {/* Grid */}
                {displayedBooks.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">No results found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayedBooks.map((book) => (
                            <div
                                key={book.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden group hover:scale-105 transition-transform duration-300"
                            >
                                <div className="relative">
                                    <img
                                        src={book.image} 
                                        alt={book.title}
                                        className="w-full h-72 object-cover object-bottom"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                        <button className="bg-accent text-black px-4 py-2 rounded-md flex items-center space-x-2">
                                            <span>Read Now</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="font-semibold text-gray-800">{book.title}</h3>
                                    <p className="text-gray-500 text-sm">By {book.author}</p>
                                    <span className="text-xs text-accent font-medium mt-2 block">
                                        Free
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
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
            </div>
        </section>
    );
};

export default FreeBooks;
