"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Save, CalendarDays, ClipboardCopy } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export interface Student {
  _id: string;
  name: string;
  email: string;
  educationMail?: string;
  phone?: string;
  price: number;
  status: string;
  serialNumber: number;
  trialClasses: {
    assigned: number;
    completed: number;
  };
  feeStatus: {
    paid: boolean;
  };
  parentInquiry: {
    _id: string;
    dueDate: string | null;
    extendedDueDate: string | null;
    paymentLink: string | null;
    paymentStatus?: {
      paid: boolean;
      lastPaymentDate?: string;
    };
  };
  course?: {
    _id: string;
    title: string;
  } | null;
  teacherAssigned?: {
    _id: string;
    name: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Teacher {
  _id: string;
  name: string;
}

export function formatDate(dateString: string | null) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const fee_columns = ({
  teachers,
  onSave,
  onUpdate,
  isRowChanged, // 🧠 New prop
}: {
  teachers: Teacher[];
  onSave: (student: Student) => void;
  onUpdate: (updated: Student) => void;
  isRowChanged: (student: Student) => boolean; // 🧠 New prop type
}): ColumnDef<Student>[] => [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "educationMail",
    header: "Educational Email",
    cell: ({ row }) => row.original.educationMail || "N/A",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
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
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "parentInquiry.dueDate",
    header: "Next Due Date",
    cell: ({ row }) => formatDate(row.original.parentInquiry?.dueDate),
  },
  {
    accessorKey: "parentInquiry.extendedDueDate",
    header: "Link Disable Date",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const selected = row.original.parentInquiry.extendedDueDate
        ? new Date(row.original.parentInquiry.extendedDueDate)
        : null;

      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="flex gap-2">
              <CalendarDays className="w-4 h-4" />
              {selected ? format(selected, "dd MMM yyyy") : "Select"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar
              mode="single"
              selected={selected ?? undefined}
              onSelect={(date) => {
                if (!date) return;
                const updated = {
                  ...row.original,
                  parentInquiry: {
                    ...row.original.parentInquiry,
                    extendedDueDate: date.toISOString(),
                  },
                };
                onUpdate(updated);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    id: "linkStatus",
    header: "Link Status",
    cell: ({ row }) => {
      const today = new Date();
      const extended = row.original.parentInquiry?.extendedDueDate
        ? new Date(row.original.parentInquiry.extendedDueDate)
        : null;

      const isDisabled = extended && today > extended;

      return (
        <div
          className={`px-2 py-1 rounded-sm text-center font-medium ${
            isDisabled ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
          }`}
        >
          {isDisabled ? "Disabled" : "Enabled"}
        </div>
      );
    },
  },
  {
    accessorKey: "parentInquiry.paymentLink",
    header: "Payment Link",
    cell: ({ row }) => {
      const paymentLink = row.original.parentInquiry.paymentLink;

      const handleCopy = () => {
        if (!paymentLink) return;
        navigator.clipboard.writeText(paymentLink);
        toast.success(" Payment link copied!");
      };

      return paymentLink ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-1"
        >
          <ClipboardCopy className="w-4 h-4" />
          Copy
        </Button>
      ) : (
        <span className="text-gray-400">—</span>
      );
    },
  },
  {
    accessorKey: "teacherAssigned",
    header: "Teacher Assigned",
    cell: ({ row }) => {
      const current = row.original.teacherAssigned?._id || "";
      return (
        <Select
          value={current}
          onValueChange={(value) => {
            const selectedTeacher = teachers.find((t) => t._id === value);
            const updated = {
              ...row.original,
              teacherAssigned: selectedTeacher
                ? { _id: selectedTeacher._id, name: selectedTeacher.name }
                : null,
            };
            onUpdate(updated);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Assign Teacher" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map((t) => (
              <SelectItem key={t._id} value={t._id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="default"
        size="sm"
        className="flex gap-1 items-center"
        disabled={!isRowChanged(row.original)} // 🧠 disable if no change
        onClick={() => onSave(row.original)}
      >
        <Save className="w-4 h-4" />
        Save
      </Button>
    ),
  },
];
