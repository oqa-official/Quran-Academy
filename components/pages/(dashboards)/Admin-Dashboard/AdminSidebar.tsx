
// Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Menu,
  ArrowBigLeft,
  ArrowBigRight,
  Users,
  BookOpen,
  LayoutDashboard,
  Library,
  MailOpen,
  User,
   Phone,     
  Settings, 
} from 'lucide-react';
import { useState, useEffect } from 'react';

const iconMap: Record<string, React.ElementType> = {
  users: Users,
  bookOpen: BookOpen,
  layout_dashboard : LayoutDashboard,
  library: Library,
  mailOpen: MailOpen,
  user: User,
   phone: Phone,        
  settings: Settings,
};

interface SidebarLink {
  href: string;
  label: string;
  icon: keyof typeof iconMap; // ✅ string key
}

interface SidebarProps {
  links: SidebarLink[];
  dashboardName: string;
}

export default function Sidebar({ links, dashboardName }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => {
  if (href === '/admin-dashboard' || href==='/student-dashboard' || href==='/teacher-dashboard') {
    return pathname === href;
  }
  return pathname.startsWith(href);
};

  const renderLinks = (isMobile = false) =>
    links.map(({ href, label, icon }) => {
      const Icon = iconMap[icon]; // ✅ resolve component here
      return (
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
      );
    });

  return (
    <div className="bg-primary">
      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-3 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-primary text-white">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-primary text-white w-64">
            <aside className="flex flex-col h-full">
              <div className="py-4 text-center text-xl font-semibold border-b border-gray-700">
                {dashboardName}
              </div>
              <nav className="flex-1 px-4 py-6 space-y-2">{renderLinks(true)}</nav>
            </aside>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex ${
          collapsed ? 'w-24' : 'w-64'
        } bg-primary text-white flex-col rounded-r-sm py-6 p-3 h-[100vh] transition-all duration-300`}
      >
        <div className="flex justify-between items-center px-2 border-b border-gray-700">
          {!collapsed && (
            <span className="text-base font-semibold">{dashboardName}</span>
          )}
          <div
            onClick={() => setCollapsed(!collapsed)}
            className="cursor-pointer p-1 hover:bg-accent hover:rounded-sm"
          >
            {!collapsed ? (
              <ArrowBigLeft size={28} strokeWidth={1} />
            ) : (
              <ArrowBigRight size={28} strokeWidth={1} />
            )}
          </div>
        </div>
        <nav className="flex-1 px-2 py-6 space-y-2">{renderLinks()}</nav>
      </aside>
    </div>
  );
}
