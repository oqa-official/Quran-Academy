
"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


import { useEffect, useState } from "react";
import { Trash2, Search, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Inquire {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  studentCount?: number; // new
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquire[]>([]);
  const [filtered, setFiltered] = useState<Inquire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        // 🔹 Backend endpoint should aggregate student counts
        const res = await fetch("/api/db/inquire/with-students");
        if (!res.ok) throw new Error("Failed to fetch inquiries");
        const data = await res.json();
        setInquiries(data);
        setFiltered(data);
      } catch (err: any) {
        setError(err.message || "Error loading inquiries");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const handleSearch = (val: string) => {
    setSearch(val);
    const lower = val.toLowerCase();
    const results = inquiries.filter(
      (inq) =>
        inq.name.toLowerCase().includes(lower) ||
        inq.email.toLowerCase().includes(lower)
    );
    setFiltered(results);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/db/inquire/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete inquiry");

      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
      setFiltered((prev) => prev.filter((inq) => inq._id !== id));
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  // CSV export
  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Date", "Student Count"];
    const rows = filtered.map((inq) => [
      inq.name,
      inq.email,
      inq.phone,
      new Date(inq.createdAt).toLocaleDateString(),
      inq.studentCount || 0,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inquiries.csv";
    a.click();
  };

  const startIndex = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const totalCount = filtered.length;

  const showingFrom = totalCount === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(startIndex + itemsPerPage, totalCount);

  return (
    <div className="bg-white rounded-xl shadow-md md:p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Inquiries</h1>
        <Button onClick={exportCSV}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Total Count */}
      <p className="text-sm text-gray-600 mb-2">
        Total Inquiries: <span className="font-semibold">{totalCount}</span>
      </p>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-72"
        />
        <Search className="text-gray-400" />
      </div>

      {/* Error */}
      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full bg-primary h-10 rounded-md" />
          ))}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length > 0 ? (
                  paginated.map((inq) => (
                    <TableRow key={inq._id}>
                      <TableCell>{inq.name}</TableCell>
                      <TableCell>{inq.email}</TableCell>
                      <TableCell>{inq.phone}</TableCell>
                      <TableCell>
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{inq.studentCount || 0}</TableCell>
                      <TableCell>
                        <Link
                          href={`/admin-dashboard/students?inquire=${inq._id}`}
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" /> View
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                inquiry and remove it from our records.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(inq._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>

                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">
                      No inquiries found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
