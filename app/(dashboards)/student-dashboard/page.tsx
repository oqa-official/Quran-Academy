
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStudentData } from "@/components/pages/(dashboards)/Student-Dashboard/StudentDataProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import StudentDashboardCards from "@/components/pages/(dashboards)/Student-Dashboard/DashboardCards";
import {  Link2 } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const { parentInquiry, setParentInquiry } = useStudentData() as {
    parentInquiry: any | null;
    setParentInquiry: (inq: any) => void;
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [generating, setGenerating] = useState(false);

  // compute status
  const debugInfo = useMemo(() => {
    if (!parentInquiry) return null;
    const now = new Date();
    const paid = parentInquiry.paymentStatus?.paid ?? false;
    const lastPaymentDate = parentInquiry.paymentStatus?.lastPaymentDate
      ? new Date(parentInquiry.paymentStatus.lastPaymentDate)
      : null;
    const dueDate = parentInquiry.dueDate ? new Date(parentInquiry.dueDate) : null;
    const extendedDueDate = parentInquiry.extendedDueDate
      ? new Date(parentInquiry.extendedDueDate)
      : null;

    let expired = !paid;
    if (paid && lastPaymentDate) {
      const daysDiff = Math.floor(
        (now.getTime() - lastPaymentDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      expired = daysDiff >= 28;
    }

    return {
      now,
      paid,
      lastPaymentDate,
      dueDate,
      extendedDueDate,
      expired,
    };
  }, [parentInquiry]);

  useEffect(() => {
    if (!parentInquiry || !debugInfo) {
      setModalOpen(false);
      setShowAlert(false);
      return;
    }

    const { expired, dueDate, extendedDueDate } = debugInfo;
    const now = new Date();

    const fullyExpired = expired && extendedDueDate && extendedDueDate <= now;
    const softExpired = expired && dueDate && dueDate <= now && (!extendedDueDate || extendedDueDate > now);

    setModalOpen(Boolean(fullyExpired));
    setShowAlert(Boolean(softExpired));

    // auto-generate payment link if soft expired and no link exists
    if (softExpired && !parentInquiry.paymentLink) {
      (async () => {
        setGenerating(true);
        try {
          const res = await fetch(`/api/payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ parentInquiry: parentInquiry._id }),
          });
          if (!res.ok) throw new Error("Failed to create payment link");
          const { url } = await res.json();
          setParentInquiry({ ...parentInquiry, paymentLink: url });
          toast.success("Payment link generated successfully.");
        } catch (err) {
          console.error("Payment link generation failed:", err);
          toast.error("Failed to generate payment link.");
        } finally {
          setGenerating(false);
        }
      })();
    }
  }, [parentInquiry, debugInfo, setParentInquiry]);

  // 👉 handlers
  const handlePayNow = () => {
    if (parentInquiry?.paymentLink) {
      window.open(parentInquiry.paymentLink, "_blank");
    } else {
      router.push("/student-dashboard/payments");
    }
  };

  const handlePayLater = async () => {
    if (!parentInquiry) return;
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);

    try {
      const res = await fetch(`/api/db/inquire/${parentInquiry._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dueDate: newDate }),
      });
      if (!res.ok) throw new Error("Failed to update due date");
      const updatedInquiry = await res.json();
      setParentInquiry(updatedInquiry);
      setShowAlert(false);
      toast.success("Payment postponed for 1 day.");
    } catch (err) {
      console.error("PayLater failed:", err);
      toast.error("Failed to update due date.");
    }
  };

  const handleShareLink = () => {
    if (parentInquiry?.paymentLink) {
      navigator.clipboard.writeText(parentInquiry.paymentLink);
      toast.success("Payment link copied to clipboard!");
    }
  };

  const handleBlockingPayNow = async () => {
    if (!parentInquiry) return;

    if (parentInquiry.paymentLink) {
      window.location.href = parentInquiry.paymentLink;
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentInquiry: parentInquiry._id }),
      });
      if (!res.ok) throw new Error("Failed to create payment link");
      const { url } = await res.json();
      setParentInquiry({ ...parentInquiry, paymentLink: url });
      window.location.href = url;
    } catch (err) {
      console.error("Failed to create payment link:", err);
      toast.error("Failed to generate payment link.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Student Dashboard</h1>

      {/* 🔒 Blocking modal */}
      <Dialog open={modalOpen} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-lg dark:bg-[#122031]">
          <DialogHeader>
            <DialogTitle>Please make the payments to continue</DialogTitle>
            <DialogDescription>
              Your subscription is fully expired. You must complete the payment to proceed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button onClick={handleBlockingPayNow} className="w-full" disabled={generating}>

              {generating ? "Generating..." : "Pay Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ⚠️ Soft expired alert */}
      {showAlert && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>⚠ Payment Required</AlertTitle>
          <AlertDescription>
            Your monthly fee is pending or overdue. Please complete the payment to avoid suspension.
          </AlertDescription>
          <div className="mt-3 flex gap-2">
            <Button onClick={handlePayNow} disabled={generating}>
              {generating ? "Generating..." : "Pay Now"}
            </Button>
            <Button variant="outline" className="hover:bg-gray-100" onClick={handlePayLater}>
              Pay Later
            </Button>

            {parentInquiry?.paymentLink && (
              <Button className="bg-accent hover:bg-accent-hover text-black" onClick={handleShareLink}>
                Share Link <Link2 />
              </Button>
            )}

            <Link href="/student-dashboard/payments/wise">
              <Button variant="outline" className="bg-[#285902] dark:bg-[#9bda6b] hover:bg-[#2a3b1d] dark:hover:bg-[#719158] text-white dark:text-black">
                Pay Via Wise
              </Button>
            </Link>
          </div>
        </Alert>
      )}

      <StudentDashboardCards meetingLinkActive={!modalOpen} />
    </div>
  );
}
