
"use client";

import EmailEditor from "@/components/pages/(dashboards)/Admin-Dashboard/email/EmailEditor";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentCreatedEmailPage() {
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const res = await fetch("/api/email?event=inquiry_fill");
        const data = await res.json();
        setTemplate(data); // API returns object (filtered by event)
      } catch (err) {
        console.error("Failed to fetch template:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplate();
  }, []);

  if (loading)
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-1/3 bg-white dark:bg-[#122031]"/>
        <Skeleton className="h-[500px] w-full bg-white dark:bg-[#122031]" />
      </div>
    );

  if (!template) return <p className="p-6 text-red-500">Template not found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Edit Instructor Created Template</h1>
      <EmailEditor template={template}
        requiredFields={["name", "link"]}
      />
    </div>
  );
}
