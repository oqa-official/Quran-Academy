


// "use client";

// import { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { X } from "lucide-react"; // for cross button
// import NumberCollection from "../pages/inquire/NumberCollection";

// export function OfferPopup() {
//   const [open, setOpen] = useState(false);

//   // Open automatically when page loads
//   useEffect(() => {
//     setOpen(true);
//   }, []);

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className=" md:min-w-2xl   w-full p-0 overflow-hidden border-none md:min-h-[500px]">
//         {/* Close Button */}
//         <button
//           onClick={() => setOpen(false)}
//           className="absolute z-1000 top-3 right-3 p-1 rounded-full bg-primary text-white"
//         >
//           <X className="h-5 w-5 text-white" />
//         </button>

//         <div className="relative grid md:grid-cols-2 h-full">
//           {/* Background Image with Overlay */}
//           <div className="absolute inset-0">
//             <img
//               src="/assets/global/popup.png"
//               alt="Special Offer"
//               className="w-full h-full object-cover object-right-bottom"
//             />
//             <div className="absolute inset-0 bg-primary/50" />
//           </div>

//           {/* Empty column for image on desktop */}
//           <div className="hidden md:block" />

//           {/* Right Form */}
//           <div className="relative h-full w-full flex flex-col items-center w-full z-10 p-6 sm:p-8 bg-white/95 rounded-l-2xl md:rounded-none">
//             <DialogHeader>
//               <DialogTitle className="text-2xl font-bold text-center">
//                 <span className="block text-sm font-medium italic">
//                   Get Your Free
//                 </span>
//                 <span className="text-primary text-3xl">
//                   <span className="text-accent">07</span> Days Trial
//                 </span>{" "}
//                 Now!
//               </DialogTitle>
//             </DialogHeader>

//            <NumberCollection/>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }


















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

export function OfferPopup() {
  const { open, setOpen } = usePopup();

  // ✅ Check localStorage once on mount
  useEffect(() => {
    const dismissedUntil = localStorage.getItem("popupDismissedUntil");
    const now = Date.now();

    if (!dismissedUntil || now > Number(dismissedUntil)) {
      setOpen(true);
    }
  }, [setOpen]);

  // ✅ Handle close (manual close or after successful submission)
  const handleClose = () => {
    setOpen(false);
    const sevenDaysLater = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem("popupDismissedUntil", sevenDaysLater.toString());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:min-w-2xl w-full p-0 overflow-hidden border-none md:min-h-[500px]">
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
