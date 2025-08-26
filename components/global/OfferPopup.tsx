"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react"; // for cross button

export function OfferPopup() {
  const [open, setOpen] = useState(false);

  // Open automatically when page loads
  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" md:min-w-2xl  w-full p-0 overflow-hidden border-none">
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 z-20 p-1 rounded-full bg-primary text-white"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        <div className="relative grid md:grid-cols-2">
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
          <div className="relative z-10 p-6 sm:p-8 bg-white/95 rounded-l-2xl md:rounded-none">
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

            {/* Form */}
            <form className="mt-4 space-y-4">
              <Input
                placeholder="Enter Your Name Here*"
                className="w-full focus:ring-0 focus:outline-none focus:border-none"
              />
              <Input
                type="email"
                placeholder="Enter Your Email Here*"
                className="w-full focus:ring-0 focus:outline-none focus:border-none"
              />
              <Input
                type="tel"
                placeholder="Enter Your Number Here*"
                className="w-full focus:ring-0 focus:outline-none focus:border-none"
              />

              <Select>
                <SelectTrigger className="w-full focus:ring-0 focus:outline-none focus:border-none">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tajweed">Tajweed Course</SelectItem>
                  <SelectItem value="quran">Quran Course</SelectItem>
                  <SelectItem value="arabic">Arabic Course</SelectItem>
                </SelectContent>
              </Select>

              <div>
                <Label className="mb-2 block">I Want To Enroll For?</Label>
                <RadioGroup defaultValue="myself" className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="myself" id="myself" />
                    <Label htmlFor="myself">My Self</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="child" id="child" />
                    <Label htmlFor="child">My Child</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Fake reCAPTCHA */}
              <div className="flex items-center justify-between border rounded-md px-3 py-4 text-sm text-gray-700 bg-white w-full">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-5 h-5 border-gray-400" />
                  <span>I’m not a robot</span>
                </div>
                <img
                  src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                  alt="reCAPTCHA"
                  className="h-6"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover rounded-sm"
              >
                Claim 7 Days Free Trial
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
