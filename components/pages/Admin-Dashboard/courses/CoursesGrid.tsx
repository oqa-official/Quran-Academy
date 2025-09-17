"use client";
import { DataTable } from "@/components/global/data-table";
import { Button } from "@/components/ui/button";
import { Course } from "@/lib/types/courses";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import Link from "next/link";

const columns: ColumnDef<Course>[] = [

  {
    accessorKey: "coverImage",
    header: "Image",
    cell: ({ row }) => (
      <img
        src={row.original.image}
        alt={row.original.title}
        className="h-12 w-20 object-cover rounded-sm"
      />
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.original.title || "Untitled";
      return title.length > 20 ? title.slice(0, 20) + "..." : title;
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) =>
      row.original.duration ? row.original.duration.toString() : "N/A",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) =>
      row.original.price != null ? `$${row.original.price}` : "N/A",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Link
        href={`/admin_dashboard/courses/edit-course/${row.original._id}`}
        className="px-3 py-1 rounded"
      >
        <Button variant="outline" size="icon">
          <Pencil className="w-4 h-4" />
        </Button>
      </Link>
    ),
  },
];

export default function CoursesGrid({ courses }: { courses: Course[] }) {
  return (
    <DataTable
      searchPlaceholder="Search Courses"
      columns={columns}
      data={courses}
      searchKey="title" 
    />
  );
}
