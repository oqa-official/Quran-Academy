import React from 'react';

// Define the type for a single book item
interface BookItem {
  title: string;
  readLink: string;
  imageUrl: string;
  altText: string;
}

const FeaturedBooks = () => {
  // Demo data for the featured books
  const books: BookItem[] = [
    {
      title: 'Essential Duas',
      readLink: '#',
      imageUrl: '/assets/courses/book1.png',
      altText: 'Cover for Essential Duas',
    },
    {
      title: 'Fundamental Arabic Book 2',
      readLink: '#',
      imageUrl: '/assets/courses/book2.png',
      altText: 'Cover for Fundamental Arabic Book 2',
    },
    {
      title: 'Fundamental Arabic Book 1',
      readLink: '#',
      imageUrl: "/assets/courses/book3.png",
      altText: 'Cover for Fundamental Arabic Book 1',
    },
  ];

  return (
    // Main container with padding and a background
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Title of the section */}
      <h2 className="text-2xl font-bold mb-6 text-primary">Featured Books</h2>
      
      {/* Flex container for the books, stacking vertically with gap */}
      <div className="flex flex-col space-y-4">
        {books.map((book, index) => (
          // Book item container with card-like styling and hover effect
          <div
            key={index}
            className="relative rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-[1.02] cursor-pointer"
          >
            {/* The book cover image */}
            <img
              src={book.imageUrl}
              alt={book.altText}
              className="w-full h-auto object-cover"
            />
            
            {/* Overlay for text content */}
            <div className="absolute inset-0 bg-primary opacity-60 flex flex-col items-center justify-center p-4 text-white">
              {/* Book title */}
              <h3 className="text-xl font-semibold mb-2 text-center">
                {book.title}
              </h3>
              
              {/* Read Now link with accent color and hover effect */}
              <a
                href={book.readLink}
                className="text-accent underline hover:no-underline font-semibold"
              >
                Read Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedBooks;