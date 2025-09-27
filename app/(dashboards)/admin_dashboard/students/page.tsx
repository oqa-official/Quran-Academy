"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, RefreshCcw, Trash2, Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import EditStudentDialog from "@/components/pages/(dashboards)/Admin-Dashboard/student/EditStudentDialog";
import { toast } from "sonner";
import { DataTable } from "@/components/global/data-table"; // Import the DataTable
import { ColumnDef } from "@tanstack/react-table";
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
import Link from "next/link";
import LoadingSkeleton from "@/components/pages/(dashboards)/Admin-Dashboard/loading/loadingSkeleton";

interface Student {
    _id: string;
    parentInquiry: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: Date,
    userId: string
    gender: string,
    timezone: string;
    preferredStartTime: string;
    classDays: string[];
    course: { _id: string; title: string } | null;
    price: number;
    status: "trial" | "regular";
    feeStatus: { paid: boolean };
    createdAt: string;
}

function StudentsPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const inquireId = searchParams.get("inquire");

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState<Student | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                let url = "/api/db/students";
                if (inquireId) url += `?inquire=${inquireId}`;

                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch students");

                const data = await res.json();

                // ✅ Only keep students with status "trial"
                const trialStudents = data.filter(
                    (student: any) => student.status !== "trial"
                );

                setStudents(trialStudents);
            } catch (err: any) {
                setError(err.message || "Error loading students");
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [inquireId]);

    const handleResetFilter = () => {
        router.push("/admin_dashboard/students");
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/db/students/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete student");
            setStudents((prev) => prev.filter((s) => s._id !== id));
            toast.success("Student deleted successfully");
        } catch (err: any) {
            setError(err.message || "Delete failed");
        }
    };

    const columns: ColumnDef<Student>[] = [
        {
            accessorKey: "userId", // Changed from "userId" to match the data model
            header: "User ID",
            cell: ({ row }) => (
                <span className="font-mono text-xs">
                    {row.original.userId.toUpperCase()}
                </span>
            ),
        },
        {
            accessorKey: "name",
            enableGlobalFilter: true,
            header: "Name",
            cell: ({ row }) => {
                const value = row.getValue("name") as string;
                return value && value.length > 15 ? value.substring(0, 15) + "..." : value;
            },
        },
        {
            accessorKey: "email",
            enableGlobalFilter: true,
            header: "Email",
            cell: ({ row }) => {
                const value = row.getValue("email") as string;
                return value && value.length > 17 ? value.substring(0, 17) + "..." : value;
            },
        },
        {
            accessorKey: "gender",
            enableGlobalFilter: true,
            header: "Gender",
            cell: ({ row }) => (
                <div className="flex items-center bg-[#189c564a] text-center  px-3 py-1 rounded-sm">
                    <span>{row.original.gender}</span>
                </div>
            ),
        },

        {
            accessorKey: "dateOfBirth",
            enableGlobalFilter: true,
            header: "Date of Birth",
            cell: ({ row }) =>
                row.original.dateOfBirth
                    ? new Date(row.original.dateOfBirth).toLocaleDateString()
                    : "N/A",
        },

        {
            accessorKey: "phone",
            header: "Phone",
        },

        {
            accessorKey: "timezone",
            header: "Timezone",
        },
        {
            accessorKey: "educationMail",
            enableGlobalFilter: true,
            header: "Edu Email",
        },
        {
            accessorKey: "password",
            enableGlobalFilter: true,
            header: "Password",
        },
        {
            accessorKey: "preferredStartTime",
            header: "Preferred Time",
        },
        {
            accessorKey: "classDays",
            header: "Class Days",
            cell: ({ row }) => row.original.classDays.join(" / "),
        },

        {
            accessorKey: "course.title",
            enableGlobalFilter: true,
            header: "Course",
            cell: ({ row }) => {
                const value = row.original.course?.title;
                return value && value.length > 15 ? value.substring(0, 15) + "..." : value || "N/A";
            },
        }
        ,
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => `$${row.original.price}`,
        },
        {
            accessorKey: "status",
            enableGlobalFilter: true,
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;

                // ✅ Map status → bg color
                const statusColors: Record<string, string> = {
                    trial: "bg-yellow-200 text-yellow-800",
                    regular: "bg-green-200 text-green-800",
                    ongoing: "bg-blue-200 text-blue-800",
                    onhold: "bg-orange-200 text-orange-800",
                    quit: "bg-red-200 text-red-800",
                    onleave: "bg-purple-200 text-purple-800",
                };

                const colorClass = statusColors[status] || "bg-gray-200 text-gray-800";

                return (
                    <div
                        className={`flex items-center justify-center px-2 py-1 rounded-sm capitalize ${colorClass}`}
                    >
                        <span>{status}</span>
                    </div>
                );
            },
        }
        ,
        {
            accessorKey: "feeStatus.paid",
            header: "Fee Paid",
            cell: ({ row }) => (row.original.feeStatus.paid ? "Yes" : "No"),
        },
        {
            accessorKey: "parentInquiry",
            header: "Parent Inquiry",
            cell: ({ row }) => (
                <Link
                    href={`/admin_dashboard/students/regular-onboardings?inquire=${row.original.parentInquiry}`}
                >
                    <Button size="sm" variant="outline">
                        View
                    </Button>
                </Link>
            ),
        },

        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setEditing(row.original)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="dark:bg-[#122031]">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the student and remove it from our records.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleDelete(row.original._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white dark:bg-[#122031] rounded-xl shadow-md md:p-4 max-w-[90vw]   md:max-w-[80vw]">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Regular Students</h1>
                <div className="flex gap-2">
                    {inquireId && (
                        <Button variant="outline" onClick={handleResetFilter}>
                            <RefreshCcw className="w-4 h-4 mr-2" /> Reset Filter
                        </Button>
                    )}
                </div>
            </div>

            {error && <p className="text-red-500 mb-3">{error}</p>}

            {loading ? (
               <LoadingSkeleton/>
            ) : (
                <DataTable columns={columns} data={students} searchPlaceholder="Search" />
            )}

            {editing && (
                <EditStudentDialog
                    open={!!editing}
                    student={editing}
                    onClose={() => setEditing(null)}
                    onSaved={(updated: any) => {
                        setStudents((prev) =>
                            prev.map((s) => (s._id === updated._id ? updated : s))
                        );
                        setEditing(null);
                    }}
                />
            )}
        </div>
    );
}

export default function StudentsPage() {
    return (
        <Suspense fallback={<div>Loading Students...</div>}>
            <StudentsPageContent />
        </Suspense>
    );
}