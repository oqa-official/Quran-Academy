// "use client";


// interface Student {
//   _id: string;
//   parentInquiry: string;
//   name: string;
//   email: string;
//   phone: string;
//   age: number;
//   timezone: string;
//   preferredStartTime: string;
//   classDays: string[];
//   course: { _id: string; title: string } | null;
//   price: number;
//   status: "trial" | "regular";
//   feeStatus: { paid: boolean };
//   createdAt: string;
// }


// interface StudentsTableProps {
//   students: Student[];
//   onDelete: (id: string) => void;
//   onEdit: (student: Student) => void;
// }




// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Trash2, Pencil } from "lucide-react";

// export default function StudentsTable({
//   students,
//   onDelete,
//   onEdit,
// }: StudentsTableProps) {
//   return (
//     <div className="overflow-x-auto">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Name</TableHead>
//             <TableHead>Email</TableHead>
//             <TableHead>Phone</TableHead>
//             <TableHead>Age</TableHead>
//             <TableHead>Timezone</TableHead>
//             <TableHead>Preferred Time</TableHead>
//             <TableHead>Class Days</TableHead>
//             <TableHead>Course</TableHead>
//             <TableHead>Price</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Fee Paid</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody >
//           {students.length > 0 ? (
//             students.map((s) => (
//               <TableRow key={s._id} className="text-center">
//                 <TableCell>{s.name}</TableCell>
//                 <TableCell>{s.email}</TableCell>
//                 <TableCell>{s.phone}</TableCell>
//                 <TableCell>{s.age}</TableCell>
//                 <TableCell>{s.timezone}</TableCell>
//                 <TableCell>{s.preferredStartTime}</TableCell>
//                 <TableCell className="text-xs">{s.classDays.join(" / ")}</TableCell>
//                 <TableCell>{s.course?.title || "N/A"}</TableCell>
//                 <TableCell>${s.price}</TableCell>
//                 <TableCell>{s.status}</TableCell>
                
//                 <TableCell>{s.feeStatus.paid ? "Yes" : "No"}</TableCell>
//                 <TableCell className="text-right space-x-2">
//                   <Button variant="outline" size="icon" onClick={() => onEdit(s)}>
//                     <Pencil className="w-4 h-4" />
//                   </Button>
//                   <Button variant="destructive" size="icon" onClick={() => onDelete(s._id)}>
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={13} className="text-center text-gray-500">
//                 No students found
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }


































"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

interface Student {
  _id: string;
  parentInquiry: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  timezone: string;
  preferredStartTime: string;
  classDays: string[];
  course: { _id: string; title: string } | null;
  price: number;
  status: "trial" | "regular";
  feeStatus: { paid: boolean };
  createdAt: string;
}

interface StudentsTableProps {
  students: Student[];
  onDelete: (id: string) => void;
  onEdit: (student: Student) => void;
}

export default function StudentsTable({
  students,
  onDelete,
  onEdit,
}: StudentsTableProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="text-center " >
          <TableRow className="bg-gray-200 text-white hover:bg-gray-300 cursor-pointer">
            <TableHead className="bg-[#d1dafa7b]">Name</TableHead>
            <TableHead className="bg-gray-100">Email</TableHead>
            <TableHead className="bg-[#d1dafa7b]">Phone</TableHead>
            <TableHead className="bg-gray-100">Age</TableHead>
            <TableHead className="bg-[#d1dafa7b]">Timezone</TableHead>
            <TableHead className="bg-gray-100">Preferred Time</TableHead>
            <TableHead className="bg-[#d1dafa7b]">Class Days</TableHead>
            <TableHead className="bg-gray-100">Course</TableHead>
            <TableHead className="bg-[#d1dafa7b]">Price</TableHead>
            <TableHead className="bg-gray-100">Status</TableHead>
            <TableHead className="bg-[#d1dafa7b]">Fee Paid</TableHead>
            <TableHead className="text-right bg-gray-100">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.length > 0 ? (
            students.map((s, idx) => (
              <TableRow
                key={s._id}
                className={`text-center ${
                  idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                }`}
              >
                <TableCell className="px-2 py-2">{s.name}</TableCell>
                <TableCell className="px-2 py-2">{s.email}</TableCell>
                <TableCell className="px-2 py-2">{s.phone}</TableCell>
                <TableCell>{s.age}</TableCell>
                <TableCell>{s.timezone}</TableCell>
                <TableCell>{s.preferredStartTime}</TableCell>
                <TableCell className="text-xs">
                  {s.classDays.join(" / ")}
                </TableCell>
                <TableCell>{s.course?.title || "N/A"}</TableCell>
                <TableCell>${s.price}</TableCell>
                <TableCell>{s.status}</TableCell>
                <TableCell>{s.feeStatus.paid ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(s)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setConfirmDelete(s._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={13} className="text-center text-gray-500">
                No students found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this student?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmDelete) onDelete(confirmDelete);
                setConfirmDelete(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
