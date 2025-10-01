"use client";

import { ReactNode, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useStudentData } from "@/components/pages/(dashboards)/Student-Dashboard/StudentDataProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MeetingCardWrapperProps {
  children: React.ReactNode;
}

export default function MeetingCardWrapper({ children }: MeetingCardWrapperProps) {
  const { students } = useStudentData();
  const [timeActive, setTimeActive] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const student = students?.[0]; // assuming single student per login

  useEffect(() => {
    if (!student) return;

    const { timezone, preferredStartDate, preferredStartTime, classDays } = student;
    const now = DateTime.now().setZone(timezone || "UTC");

    // 1️⃣ Check start date
    const startDate = DateTime.fromISO(preferredStartDate, { zone: timezone });
    if (now < startDate) {
      setTimeActive(false);
      return;
    }

    // 2️⃣ Check class day
    const today = now.toFormat("ccc"); // Mon, Tue, Wed
    if (!classDays.includes(today)) {
      setTimeActive(false);
      return;
    }

    // 3️⃣ Check time slot (1 hour window)
    const [time, period] = preferredStartTime.split(" ");
    const [hour, minute] = time.split(":").map(Number);
    let startHour = hour % 12;
    if (period?.toUpperCase() === "PM") startHour += 12;

    const classStart = now.set({ hour: startHour, minute: minute || 0, second: 0 });
    const classEnd = classStart.plus({ hours: 1 });

    setTimeActive(now >= classStart && now <= classEnd);
  }, [students]);

  const handleBlockedClick = () => setShowDialog(true);

  return (
    <>
      {timeActive ? (
        // ✅ If allowed → render normally
        <>{children}</>
      ) : (
        // ❌ If blocked → wrap with disabled div
        <div onClick={handleBlockedClick} className="opacity-50 cursor-not-allowed">
          {children}
        </div>
      )}

      {/* Timing Block Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Your class link is only available during your scheduled time.
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
