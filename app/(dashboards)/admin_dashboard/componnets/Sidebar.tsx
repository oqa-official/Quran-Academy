"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import { NAV_DATA_ADMIN, NAV_DATA_STUDENT, NAV_DATA_TEACHER } from "@/lib/constants/data";
import { ChevronUp, Menu, X } from "lucide-react";
import { LucideIcon } from "lucide-react";

// shadcn/ui imports
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

// context for form dirty state
import { useDirtyForm } from "@/context/DirtyFormContext";

export type NavItem = {
  title: string;
  url?: string;
  icon: LucideIcon;
  items?: NavItem[];
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

interface SidebarProps {
  role: "admin" | "student" | "teacher";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const { isDirty, setDirty } = useDirtyForm();

  const navData: NavSection[] =
    role === "admin"
      ? NAV_DATA_ADMIN
      : role === "student"
      ? NAV_DATA_STUDENT
      : NAV_DATA_TEACHER;

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  useEffect(() => {
    navData.forEach((section) => {
      section.items.forEach((item) => {
        if (item.items?.some((sub) => sub.url === pathname)) {
          if (!expandedItems.includes(item.title)) {
            setExpandedItems((prev) => [...prev, item.title]);
          }
        }
      });
    });
  }, [pathname, navData, expandedItems]);

  // central navigation handler
  const handleNavigation = (href: string) => {
    if (isDirty) {
      setPendingNavigation(href);
      setShowAlert(true);
    } else {
      router.push(href);
      setIsOpen(false);
    }
  };

const proceedNavigation = () => {
  if (pendingNavigation) {
    router.push(pendingNavigation);
    setPendingNavigation(null);
    setShowAlert(false);
    setIsOpen(false);
    setDirty(false); // ← reset dirty state here
  }
};


  const cancelNavigation = () => {
    setPendingNavigation(null);
    setShowAlert(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 rounded-md bg-gray-200 p-2 dark:bg-gray-800"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-[#122031] lg:sticky lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full min-h-[100vh] flex-col py-6 px-4">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => handleNavigation("/")}
              className="text-xl font-bold text-gray-800 dark:text-gray-100"
            >
              Quran {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden rounded-md p-1 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {navData.map((section) => (
              <div key={section.label} className="mb-6">
                <h2 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {section.label}
                </h2>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item.title}>
                      {item.items ? (
                        <div>
                          <button
                            onClick={() => toggleExpanded(item.title)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
                              item.items.some((sub) => sub.url === pathname) &&
                                "bg-gray-100 dark:bg-gray-800 font-medium"
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                            <span className="text-lg">{item.title}</span>
                            <ChevronUp
                              className={cn(
                                "ml-auto h-4 w-4 transition-transform",
                                expandedItems.includes(item.title) ? "rotate-0" : "rotate-180"
                              )}
                            />
                          </button>
                          {expandedItems.includes(item.title) && (
                            <ul className="ml-8 mt-1 space-y-1">
                              {item.items.map((sub: NavItem) => (
                                <li key={sub.title}>
                                  <button
                                    onClick={() => handleNavigation(sub.url ?? "#")}
                                    className={cn(
                                      "block w-full text-left rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                                      pathname === sub.url &&
                                        "bg-gray-200 dark:bg-gray-700 font-medium"
                                    )}
                                  >
                                    {sub.title}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleNavigation(item.url ?? "#")}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
                            pathname === item.url &&
                              "bg-gray-200 dark:bg-gray-700 font-medium"
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* AlertDialog for unsaved changes */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent className="dark:bg-[#122031]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-poppins">Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. If you leave this page, your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelNavigation}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={proceedNavigation}>Proceed</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
