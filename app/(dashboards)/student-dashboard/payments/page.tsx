"use client";

import { useStudentData } from "@/components/pages/(dashboards)/Student-Dashboard/StudentDataProvider";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, Check, TicketCheckIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

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
}

export default function PaymentsPage() {
  const {
    students,
    totalFee,
    loading,
    parentInquiry,
    setParentInquiry, // ✅ now recognized
  } = useStudentData() as {
    students: any[];
    totalFee: number;
    loading: boolean;
    parentInquiry: Inquiry | null;
    setParentInquiry: (inquiry: Inquiry) => void; // <-- added type
  };

  const [generating, setGenerating] = useState(false);

  // ✅ Inquiry payment status
  const inquiryPaid = parentInquiry?.paymentStatus?.paid ?? false;
  const inquiryLastPaymentDate = parentInquiry?.paymentStatus?.lastPaymentDate
    ? new Date(parentInquiry.paymentStatus.lastPaymentDate)
    : null;

  // ✅ Expiry check (1 month gap)
  const isExpired = useMemo(() => {
    if (!inquiryLastPaymentDate) return false;
    const now = new Date();
    const diffMonths =
      (now.getFullYear() - inquiryLastPaymentDate.getFullYear()) * 12 +
      (now.getMonth() - inquiryLastPaymentDate.getMonth());
    return diffMonths >= 1;
  }, [inquiryLastPaymentDate]);

  if (loading) {
    return <p className="text-center py-6">Loading payment info...</p>;
  }

  if (!parentInquiry || students.length === 0) {
    return (
      <p className="text-center py-6 text-red-500">
        No students found for this inquiry.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Payment Summary</h1>

      {/* Student Table */}
      <div className="rounded-lg border bg-white dark:bg-[#122031] shadow p-4">
        <h2 className="text-lg font-medium mb-3">
          Regular Sibling Students Fee Details
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Educational Email</th>
                <th className="px-4 py-2 border">User ID</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border text-right">Fee</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-t dark:border-gray-700">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.educationMail}</td>
                  <td className="px-4 py-2">{s.userId}</td>
                  <td className="px-4 py-2 capitalize">{s.status}</td>
                  <td className="px-4 py-2 text-right font-medium">
                    ${s.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Fee */}
      <div
        className="flex justify-between items-center text-lg font-semibold dark:bg-[#122031]
                bg-white p-3 rounded-md"
      >
        <span className="text-accent font-merriweather">Total Fee</span>
        <span className="text-accent text-2xl font-merriweather">
          ${totalFee}
        </span>
      </div>

      {/* Payment Action */}
      <div className="pt-4">
        {inquiryPaid && inquiryLastPaymentDate && !isExpired ? (
          <p className="text-green-600 font-medium flex gap-2">
            <Check/> You have already paid. Last Payment Date:{" "}
            <span className="text-accent">
            {inquiryLastPaymentDate.toLocaleDateString()}
            </span>
          </p>
        ) : (
          <>
            {/* Case 1 – Payment link exists */}
            {parentInquiry.paymentLink ? (
              <div className="space-x-3">
                <Button
                  onClick={() => window.open(parentInquiry.paymentLink!, "_blank")}
                >
                  Pay Now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(parentInquiry.paymentLink!);
                    toast.success("Payment link copied to clipboard!");
                  }}
                >
                  Copy Link
                </Button>
              </div>
            ) : (
              <>
                {/* Case 2 – Expired → regenerate link */}
                {isExpired && (
                  <div>
                    <p className="text-red-500 mb-4">
                      Your Last Payment has expired
                    </p>
                    <Button
                      onClick={async () => {
                        setGenerating(true);
                        try {
                          const res = await fetch(`/api/payment`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              parentInquiry: parentInquiry._id,
                              regenerate: true,
                            }),
                          });

                          if (!res.ok) throw new Error("Failed to create payment link");
                          const { url } = await res.json();

                          // ✅ update context immediately
                          setParentInquiry({
                            ...parentInquiry,
                            paymentLink: url,
                          });
                        } catch (err) {
                          console.error("❌ Payment creation failed:", err);
                          toast.error("Failed to initiate payment.");
                        } finally {
                          setGenerating(false);
                        }
                      }}
                    >
                      {generating ? "Generating..." : "Generate New Payment Link"}
                    </Button>
                  </div>
                )}



                {/* Case 3 – First time, no link yet */}
                {!inquiryPaid && !isExpired && !parentInquiry.paymentLink && (
                  <div>
                    <p className="text-red-400 my-3 flex justify-start gap-1"><AlertCircleIcon/> Kindly Pay Your Fee to Continue</p>
                  <Button
                    onClick={async () => {
                      setGenerating(true);
                      try {
                        const res = await fetch(`/api/payment`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            parentInquiry: parentInquiry._id,
                          }),
                        });

                        if (!res.ok) throw new Error("Failed to fetch payment link");
                        const { url } = await res.json();

                        // ✅ update context with paymentLink instead of redirecting
                        setParentInquiry({
                          ...parentInquiry,
                          paymentLink: url,
                        });
                      } catch (err) {
                        console.error("❌ Payment fetch failed:", err);
                        toast.error("Failed to create payment link.");
                      } finally {
                        setGenerating(false);
                      }
                    }}
                    disabled={generating}
                  >
                    {generating ? "Generating..." : "Generate Payment Link"}
                  </Button>
                  </div>
                )}

              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
