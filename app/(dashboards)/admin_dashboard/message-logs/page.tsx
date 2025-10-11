

"use client";

import { useEffect, useState, Suspense } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/global/data-table";
import { toast } from "sonner";
import LoadingSkeleton from "@/components/pages/(dashboards)/Admin-Dashboard/loading/loadingSkeleton";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

type CommunicationLog = {
  _id: string;
  receiverName?: string;
  receiverEmail?: string;
  receiverNumber?: string;
  receiverType: "student" | "parent" | "teacher" | "user";
  channel: "whatsapp" | "email";
  messageType:
  | "fee-reminder"
  | "class-reminder"
  | "onboarding-reminder"
  | "inquiry-fill"
  | "student-created"
  | "teacher-created"
  | "forgot-password"
  | "career-request";
  sentAt: string;
};

function CommunicationLogsContent() {
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [channel, setChannel] = useState<"email" | "whatsapp">("email");
  const [messageType, setMessageType] = useState<
    | "all"
    | "fee-reminder"
    | "class-reminder"
    | "onboarding-reminder"
    | "inquiry-fill"
    | "student-created"
    | "teacher-created"
    | "forgot-password"
    | "career-request"
  >("all");
  const [receiverType, setReceiverType] = useState<
    "all" | "student" | "parent" | "teacher" | "user"
  >("all");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("channel", channel);
      if (messageType !== "all") params.append("messageType", messageType);
      if (receiverType !== "all") params.append("receiverType", receiverType);
     if (selectedDate) {
  // Start of selected date (local)
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  // End of selected date (local)
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Send both in ISO (will auto convert to UTC but range stays correct)
  params.append("start", startOfDay.toISOString());
  params.append("end", endOfDay.toISOString());
}

      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      params.append("timezone", userTimezone);

      console.log("📅 Fetching logs with params:", params.toString());
      const res = await fetch(`/api/logs/communication-log?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to fetch logs");
      setLogs(Array.isArray(data.data) ? data.data : []);
    } catch (err: any) {
      console.error("[CommunicationLog] ❌ Error:", err);
      setError(err.message || "Error loading logs");
      toast.error(err.message || "Failed to load communication logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [channel, messageType, receiverType, selectedDate]);

  // Helpers
const formatDate = (dateString: string) => {
  // Convert to Date
  const date = new Date(dateString);

  // Format in the user's local timezone automatically
  return date.toLocaleString(undefined, {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // user's system TZ
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};


  const chipColor = (type: string) => {
    const map: Record<string, string> = {
      student: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
      parent: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
      teacher: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
      whatsapp: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
      email: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
      "fee-reminder": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
      "class-reminder": "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
      default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    };
    return map[type] || map.default;
  };

  // ✅ Dynamic Columns
  const columns: ColumnDef<CommunicationLog>[] = [
    {
      accessorKey: "receiverName",
      header: "Receiver Name",
      cell: ({ row }) => row.original.receiverName || "-",
    },

    ...(channel === "email"
      ? [
        {
          accessorKey: "receiverEmail",
          header: "Email",
          cell: ({ row }: any) => row.original.receiverEmail || "-",
        },
      ]
      : [
        {
          accessorKey: "receiverNumber",
          header: "Number",
          cell: ({ row }: any) => row.original.receiverNumber || "-",
        },
      ]),

    {
      accessorKey: "receiverType",
      header: "Recipient Type",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-sm text-xs font-medium capitalize ${chipColor(
            row.original.receiverType
          )}`}
        >
          {row.original.receiverType}
        </span>
      ),
    },
    {
      accessorKey: "channel",
      header: "Channel",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-sm text-xs font-medium capitalize ${chipColor(
            row.original.channel
          )}`}
        >
          {row.original.channel}
        </span>
      ),
    },
    {
      accessorKey: "messageType",
      header: "Message Type",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-sm text-xs font-medium capitalize ${chipColor(
            row.original.messageType
          )}`}
        >
          {row.original.messageType.replace("-", " ")}
        </span>
      ),
    },
    {
  accessorKey: "sentAt",
  header: "Sent At",
  cell: ({ row }) => (
    <span className="text-gray-500 dark:text-gray-400">
      {formatDate(row.original.sentAt)}
    </span>
  ),
},
  ];

  return (
    <div className="bg-white dark:bg-[#122031] rounded-xl shadow-md md:p-4 max-w-[90vw] md:max-w-[80vw]">
        <h2 className="text-2xl font-medium mb-4 mx-3">Messages Logs</h2>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 px-2">
          {/* Channel */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Channel:</label>
            <Select
              value={channel}
              onValueChange={(v: "email" | "whatsapp") => setChannel(v)}
            >
              <SelectTrigger className="w-[150px] dark:bg-[#0b1620]">
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message Type */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Message Type:</label>
            <Select
              value={messageType}
              onValueChange={(
                v:
                  | "all"
                  | "fee-reminder"
                  | "class-reminder"
                  | "onboarding-reminder"
                  | "inquiry-fill"
                  | "student-created"
                  | "teacher-created"
                  | "forgot-password"
                  | "career-request"
              ) => setMessageType(v)}
            >
              <SelectTrigger className="w-[200px] dark:bg-[#0b1620]">
                <SelectValue placeholder="Select message type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="fee-reminder">Fee Reminder</SelectItem>
                <SelectItem value="class-reminder">Class Reminder</SelectItem>
                <SelectItem value="onboarding-reminder">Onboarding Reminder</SelectItem>
                <SelectItem value="inquiry-fill">Inquiry Fill</SelectItem>
                <SelectItem value="student-created">Student Created</SelectItem>
                <SelectItem value="teacher-created">Teacher Created</SelectItem>
                <SelectItem value="forgot-password">Forgot Password</SelectItem>
                <SelectItem value="career-request">Career Request</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Receiver Type */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Recipient:</label>
            <Select
              value={receiverType}
              onValueChange={(v: "all" | "student" | "parent" | "teacher" | "user") =>
                setReceiverType(v)
              }
            >
              <SelectTrigger className="w-[160px] dark:bg-[#0b1620]">
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="user">Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ✅ Sent Date Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Sent Date:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[160px] justify-between dark:bg-[#0b1620]"
                >
                  {selectedDate ? (
                    format(selectedDate, "dd MMM yyyy")
                  ) : (
                    <span>Select date</span>
                  )}
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  required={false}
                  onSelect={(date) => setSelectedDate(date ?? null)}
                  disabled={(date) => date > new Date()} // 🔒 Disable future dates
                />
                {selectedDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full text-xs"
                    onClick={() => setSelectedDate(null)}
                  >
                    <X className="w-3 h-3 mr-1" /> Clear Filter
                  </Button>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <DataTable columns={columns} data={logs} searchPlaceholder="Search logs" />
      )}
    </div>
  );
}

export default function AdminCommunicationLogsPage() {
  return (
    <Suspense fallback={<div>Loading Logs...</div>}>
      <CommunicationLogsContent />
    </Suspense>
  );
}
