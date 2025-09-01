'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

// ✅ Links array
const sidebarLinks = [
  { href: '/admin-dashboard', label: 'Courses' },
  { href: '/admin-dashboard/teachers', label: 'Teachers' },
  // { href: '/admin-dashboard/reviews', label: 'Reviews' },
];

export default function Sidebar() {
  const pathname = usePathname(); // Get current path

  const renderLinks = (isMobile = false) =>
    sidebarLinks.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        className={`block py-3 px-4 rounded-lg transition ${
          pathname === href
            ? isMobile
              ? 'bg-accent text-black'
              : 'bg-accent text-black'
            : isMobile
            ? 'hover:bg-gray-800'
            : 'hover:bg-accent-hover text-white'
        }`}
      >
        {label}
      </Link>
    ));

  return (
    <div className="bg-primary">
      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden py-3 px-1 bg-primary">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-primary text-white">
            <aside className="w-64 flex flex-col rounded-r-sm py-6 p-3">
              <div className="py-4 text-center text-xl font-semibold border-b border-gray-700">
                Admin Dashboard
              </div>
              <nav className="flex-1 px-4 py-6 space-y-2">{renderLinks(true)}</nav>
            </aside>
          </SheetContent>
        </Sheet>
      </div>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 bg-primary text-white flex-col rounded-r-sm py-6 p-3 h-[100vh]">
        <div className="py-4 text-center text-xl font-semibold border-b border-gray-700">
          Admin Dashboard
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">{renderLinks()}</nav>
      </aside>
    </div>
  );
}
