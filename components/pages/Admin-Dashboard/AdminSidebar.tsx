'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, BookOpen, Users, Library, ArrowBigLeft, ArrowBigRight, MailOpen, User } from 'lucide-react';
import { useState } from 'react';

// ✅ Links array with icons
const sidebarLinks = [
  { href: '/admin-dashboard/teachers', label: 'Teachers', icon: Users },
  { href: '/admin-dashboard/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin-dashboard/library', label: 'Library', icon: Library },
  { href: '/admin-dashboard/inquire', label: 'Inquire', icon: MailOpen },
  { href: '/admin-dashboard/students', label: 'Students', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // ✅ Highlight active + subroutes
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const renderLinks = (isMobile = false) =>
    sidebarLinks.map(({ href, label, icon: Icon }) => (
      <Link
        key={href}
        href={href}
        className={`flex items-center gap-3 py-3 px-4 rounded-lg transition ${
          isActive(href)
            ? 'bg-accent text-black'
            : isMobile
            ? 'hover:bg-gray-800'
            : 'hover:bg-accent-hover text-white'
        }`}
      >
        <Icon className="w-5 h-5" />
        {!collapsed && <span>{label}</span>}
      </Link>
    ));

  return (
    <div className="bg-primary">
      {/* ✅ Hamburger Menu for Mobile */}
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

      {/* ✅ Sidebar for Desktop */}
      <aside
        className={`hidden md:flex ${
          collapsed ? 'w-24' : 'w-64'
        } bg-primary text-white flex-col rounded-r-sm py-6 p-3 h-[100vh] transition-all duration-300`}
      >
        <div className="flex justify-between items-center px-2 border-b border-gray-700">
          {!collapsed && <span className="text-base font-semibold">Admin Dashboard</span>}
          <div
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:bg-accent hover:rounded-sm"
          >
            {!collapsed ? <ArrowBigLeft size={32} strokeWidth={1}   /> : <ArrowBigRight  size={32} strokeWidth={1}/>}
            
          </div>
        </div>
        <nav className="flex-1 px-2 py-6 space-y-2">{renderLinks()}</nav>
      </aside>
    </div>
  );
}
