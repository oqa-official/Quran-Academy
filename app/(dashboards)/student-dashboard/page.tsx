

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStudentData } from "@/components/pages/(dashboards)/Student-Dashboard/StudentDataProvider";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import StudentDashboardCards from "@/components/pages/(dashboards)/Student-Dashboard/DashboardCards";
import { Link, Share } from "lucide-react";

interface PaymentStatus {
  paid: boolean;
  lastPaymentDate: string | null;
}

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  paymentLink?: string | null;
  paymentStatus?: PaymentStatus;
  dueDate?: string | Date | null; // 🔑 accept both string & Date
}

export default function Page() {
  const router = useRouter();
  const { parentInquiry, setParentInquiry } = useStudentData() as {
    parentInquiry: Inquiry | null;
    setParentInquiry: (inq: Inquiry) => void;
  };

  const [showAlert, setShowAlert] = useState(false);

  // 👉 check payment / overdue
  useEffect(() => {
    if (!parentInquiry) return;

    const paid = parentInquiry.paymentStatus?.paid ?? false;
    const lastPaymentDate = parentInquiry.paymentStatus?.lastPaymentDate
      ? new Date(parentInquiry.paymentStatus.lastPaymentDate)
      : null;

    const dueDate = parentInquiry.dueDate
      ? new Date(parentInquiry.dueDate)
      : null;

    const now = new Date();
    let expired = false;

    // check monthly expiry (>= 1 month since last payment)
    if (lastPaymentDate) {
      const diffMonths =
        (now.getFullYear() - lastPaymentDate.getFullYear()) * 12 +
        (now.getMonth() - lastPaymentDate.getMonth());
      if (diffMonths >= 1) expired = true;
    }

    // 👉 final condition
    if ((!paid || expired) && (!dueDate || dueDate <= now)) {
      console.log("🔔 Showing alert: unpaid/expired and no active dueDate");
      setShowAlert(true);
    } else {
      console.log("✅ Alert suppressed: payment valid OR dueDate still active");
      setShowAlert(false);
    }
  }, [parentInquiry]);

  // 👉 handle Pay Later
  const handlePayLater = async () => {
    if (!parentInquiry) return;

    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1); // only 1 day extension

    try {
      console.log("🟡 PUT /inquire → extending dueDate by 1 day", newDate);

      const res = await fetch(`/api/db/inquire/${parentInquiry._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dueDate: newDate }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ API error:", res.status, errText);
        toast.error("Failed to update due date on server.");
        return;
      }

      const updatedInquiry = await res.json();
      console.log("✅ Updated Inquiry:", updatedInquiry);

      setParentInquiry(updatedInquiry);
      setShowAlert(false); // dismiss immediately
      toast.success("Payment postponed for 1 day.");
    } catch (err) {
      console.error("❌ Failed to set dueDate:", err);
      toast.error("Failed to update due date.");
    }
  };

  // 👉 handle Pay Now
  const handlePayNow = () => {
    router.push("/student-dashboard/payments");
  };

  // 👉 handle Share Link
  const handleShareLink = () => {
    if (parentInquiry?.paymentLink) {
      navigator.clipboard.writeText(parentInquiry.paymentLink);
      toast.success("Payment link copied to clipboard!");
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-6">Student Dashboard</h1>

      {/* 🔔 Payment Alert */}
      {showAlert && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>⚠ Payment Required</AlertTitle>
          <AlertDescription>
            Your monthly fee is pending or overdue. Please complete the payment
            to avoid suspension.
          </AlertDescription>
          <div className="mt-3 flex gap-2">
            <Button onClick={handlePayNow} className="hover:cursor-pointer">Pay Now</Button>
            <Button variant="outline" onClick={handlePayLater} className="hover:bg-transparent hover:cursor-pointer">
              Pay Later
            </Button>
            {parentInquiry?.paymentLink && (
              <Button className="bg-accent text-black hover:bg-accent-hover hover:cursor-pointer" onClick={handleShareLink}>
                Share Link <Link/>
              </Button>
            )}
          </div>
        </Alert>
      )}

      <StudentDashboardCards />
    </div>
  );
}
