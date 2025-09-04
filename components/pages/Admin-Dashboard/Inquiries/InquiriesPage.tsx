"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Search } from "lucide-react";
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

interface Inquire {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
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
        const res = await fetch("/api/db/inquire");
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

  const startIndex = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className=" bg-white rounded-xl shadow-md md:p-4">
      <h1 className="text-2xl font-semibold mb-4">Inquiries</h1>

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
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="">
                                Delete Inquiry
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Are you sure you
                                want to delete this inquiry?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(inq._id)}
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
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-500"
                    >
                      No inquiries found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3">
            {paginated.length > 0 ? (
              paginated.map((inq) => (
                <div
                  key={inq._id}
                  className="border rounded-lg p-2 shadow-sm bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{inq.name}</p>
                      <p className="text-sm text-gray-500">{inq.email}</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Inquiry</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Are you sure you want
                            to delete this inquiry?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleDelete(inq._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="flex flex-wrap justify-between text-sm text-gray-600 mt-2">
                    <span>{inq.phone}</span>
                    <span className="text-accent">{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No inquiries found</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <p>
              Page {page} of {totalPages || 1}
            </p>
            <Button
              variant="outline"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
