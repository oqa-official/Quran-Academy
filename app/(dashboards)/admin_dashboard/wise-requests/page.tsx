"use client";

import LoadingSkeleton from "@/components/pages/(dashboards)/Admin-Dashboard/loading/loadingSkeleton";
import WiseRequestInfo from "@/components/pages/(dashboards)/Admin-Dashboard/WiseRequestInfo/WiseRequestInfo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type WisePaymentRow = {
    _id: string;
    inquiry: {
        _id: string;
        name?: string;
        email?: string;
        phone?: string;
    } | null;
    amount: number;
    screenshotUrl: string;
    cloudinaryPublicId?: string;
    status: "pending" | "approved" | "rejected";
    submittedAt: string;
    approvedAt?: string | null;
    createdAt?: string;
};

export default function AdminWiseRequestsPage() {
    const [rows, setRows] = useState<WisePaymentRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<"pending" | "approved" | "rejected">(
        "pending"
    );
    const [error, setError] = useState<string | null>(null);

    const fetchRows = async (status: string = "pending") => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/payment/wise?status=${status}`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.message || "Failed to fetch wise payments");
            }

            // Expecting array of payment objects
            const payments = Array.isArray(data.payments) ? data.payments : data;
            setRows(payments);
        } catch (err: any) {
            setError(err.message || "Error loading requests");
            toast.error(err.message || "Failed to load wise requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRows(filter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Wise Payment Requests</h1>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Filter:</label>

                    <Select
                        value={filter}
                        onValueChange={(v: "pending" | "approved" | "rejected") => {
                            setFilter(v);
                        }}
                    >
                        <SelectTrigger className="w-[160px] dark:bg-[#0b1620]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading && <LoadingSkeleton />}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {!loading && !error && (
                <WiseRequestInfo payments={rows} onRefresh={() => fetchRows(filter)} filter={filter}/>
            )}
        </div>
    );
}
