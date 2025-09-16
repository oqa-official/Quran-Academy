"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import NumberCollection from "../pages/inquire/NumberCollection";
import { usePopup } from "@/context/PopupContext";
import { usePathname } from "next/navigation";

export function OfferPopup() {
  const pathname = usePathname();
  const { open, setOpen } = usePopup();

  // Define the routes where the popup should be excluded
   const excludedRoutes = [
    "/onboarding",
    "/auth",
    "/admin-dashboard",
    "/inquire",
    "/student-dashboard",
    "/teacher-dashboard",
    "/courses", // Add this line
  ];

  const isExcludedRoute = excludedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Use useEffect to handle the popup logic based on both conditions
  useEffect(() => {
    // Only proceed if the current route is NOT an excluded route
    if (!isExcludedRoute) {
      const dismissedUntil = localStorage.getItem("popupDismissedUntil");
      const now = Date.now();

      if (!dismissedUntil || now > Number(dismissedUntil)) {
        setOpen(true);
      }
    }
  }, [setOpen, isExcludedRoute]); // Add isExcludedRoute to the dependency array

  // Handle close (manual close or after successful submission)
  const handleClose = () => {
    setOpen(false);
    const sevenDaysLater = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem("popupDismissedUntil", sevenDaysLater.toString());
  };

  // Do not render the Dialog component if it's an excluded route
  if (isExcludedRoute) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:min-w-2xl w-full p-0 overflow-hidden border-none bg-transparent md:min-h-[500px]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute z-1000 top-3 right-3 p-1 rounded-full bg-primary text-white"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        <div className="relative grid md:grid-cols-2 h-full">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src="/assets/global/popup.png"
              alt="Special Offer"
              className="w-full h-full object-cover object-right-bottom"
            />
            <div className="absolute inset-0 bg-primary/50" />
          </div>

          {/* Empty column for image on desktop */}
          <div className="hidden md:block" />

          {/* Right Form */}
          <div className="relative h-full w-full flex flex-col items-center z-10 p-6 sm:p-8 bg-white/95 rounded-l-2xl md:rounded-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                <span className="block text-sm font-medium italic">
                  Get Your Free
                </span>
                <span className="text-primary text-3xl">
                  <span className="text-accent">07</span> Days Trial
                </span>{" "}
                Now!
              </DialogTitle>
            </DialogHeader>

            <NumberCollection
              onSuccess={handleClose} // ✅ close popup after successful submission
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}