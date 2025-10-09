
"use client";

import { useUser } from "@/context/UserContext";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface StudentData {
  parentInquiry: any | null;
  students: any[];

  totalFee: number;

  loading: boolean;
  refreshData: () => Promise<void>;
  setParentInquiry: (inquiry: any) => void;
}

const StudentDataContext = createContext<StudentData | undefined>(undefined);

export function StudentDataProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useUser();
  const [data, setData] = useState<Omit<StudentData, "refreshData" | "setParentInquiry">>({
    parentInquiry: null,
    students: [],
    totalFee: 0,
    loading: true,
  });

  const fetchData = useCallback(async () => {
    if (!userId) return;

    try {
      // 1. Get student
      const studentRes = await fetch(`/api/db/students/${userId}`);
      const student = await studentRes.json();

      // 2. Get siblings (excluding quit)
      const siblingsRes = await fetch(
        `/api/db/students?inquire=${student.parentInquiry._id}`
        , {
          headers: {
            "x-internal-key": process.env.NEXT_PUBLIC_INTERNAL_API_KEY!,
          },
        });
      let siblings = await siblingsRes.json();
      siblings = siblings.filter((s: any) => s.status !== "quit");

      // 3. Calculate fee
      const totalFee = siblings.reduce((sum: number, s: any) => sum + (s.price || 0), 0);

      setData({
        parentInquiry: student.parentInquiry,
        students: siblings,
        totalFee,
        loading: false,
      });
    } catch (err) {
      console.error("❌ Failed to fetch student data:", err);
      setData((prev) => ({ ...prev, loading: false }));
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setParentInquiry = (inquiry: any) => {
    setData((prev) => ({ ...prev, parentInquiry: inquiry }));
  };

  return (
    <StudentDataContext.Provider
      value={{
        ...data,
        refreshData: fetchData,
        setParentInquiry,
      }}
    >
      {children}
    </StudentDataContext.Provider>
  );
}

export function useStudentData() {
  const ctx = useContext(StudentDataContext);
  if (!ctx) throw new Error("useStudentData must be used inside StudentDataProvider");
  return ctx;
}
