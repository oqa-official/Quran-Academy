"use client";
import { useEffect, useState } from "react";
import { ArrowUp, ChevronUp } from "lucide-react"; 
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 1.5) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center md:gap-4 gap-2 z-[500]">
      {/* WhatsApp Button */}
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600  animate-accordion-up text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110"
      >
        <FaWhatsapp size={24} />
      </a>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="bg-primary hover:bg-primary/80 text-white p-4 rounded-full shadow-sm shadow-gray-400 transition-transform transform hover:scale-110"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
}
