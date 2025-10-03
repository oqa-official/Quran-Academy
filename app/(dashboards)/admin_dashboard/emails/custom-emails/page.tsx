



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism.css";

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

const studentSubCategories = ["trial", "ongoing", "onhold", "quit", "onleave"];

const participantTypes = [
  { value: "teachers", label: "Teachers" },
  { value: "students", label: "Students" },
  { value: "all", label: "All Stakeholders" },
];

const emailTips = [
  "Keep your email responsive across devices.",
  "Use {{name}} to personalize each email.",
  "Keep subject lines short and compelling.",
  "Don’t overload with images—balance text and visuals.",
  "Always include a clear call-to-action (CTA).",
  "Test your email on desktop and mobile before sending.",
  "Avoid spammy words in subject lines.",
  "Use bullet points for readability.",
  "Add an unsubscribe or opt-out option.",
  "Keep paragraphs short and scannable.",
];

export default function CustomEmails() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("<p>Hello {{name}},</p>");
  const [sending, setSending] = useState(false);
  const [randomTip, setRandomTip] = useState("");

  const router = useRouter();

  // pick random tip once on mount
  useEffect(() => {
    setRandomTip(emailTips[Math.floor(Math.random() * emailTips.length)]);
  }, []);

  function toggleType(type: string) {
    setSelectedTypes((prev) => {
      if (type === "all") {
        return prev.includes("all") ? [] : ["all"];
      } else {
        const withoutAll = prev.filter((t) => t !== "all");
        return withoutAll.includes(type)
          ? withoutAll.filter((t) => t !== type)
          : [...withoutAll, type];
      }
    });
  }

  function toggleSubCategory(sub: string) {
    setSelectedSubCategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  }

  async function handleSend() {
    if (!subject || !body) {
      toast.error("Subject and body are required");
      return;
    }
    if (selectedTypes.length === 0) {
      toast.error("Please select at least one participant group");
      return;
    }

    setSending(true);
    try {
      const payload = {
        types: selectedTypes,
        subCategories: selectedTypes.includes("students")
          ? selectedSubCategories
          : [],
        subject,
        bodyHtml: body,
      };

      // console.log("📤 Sending payload:", payload);

      const res = await fetch("/api/email/custom-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // console.log("📥 Response status:", res.status, res.statusText);

      const data = await res.json().catch(() => null);
      // console.log("📥 Response body:", data);

      if (!res.ok) throw new Error(data?.error || "Failed to send emails");

      toast.success(
        `Emails sent successfully! (${data?.results?.length || 0})`
      );
    } catch (err: any) {
      console.error("❌ handleSend error:", err);
      toast.error(err.message || "Failed to send emails");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-[#122031] rounded-lg shadow-lg">
      <h1 className="text-xl font-semibold">Custom Emails</h1>

      {/* Required Fields */}
      <div className="mb-2 p-3 rounded bg-yellow-100 dark:bg-[#020D1A] text-yellow-800 dark:text-accent text-sm">
        ⚠️ Required fields:{" "}
        <code className="bg-yellow-200 dark:bg-[#353535] px-1 rounded mx-1">
          {"{{name}}"}
        </code>{" "}
        must be included for personalization.
      </div>

      {/* Email Tip */}
      <div className="mb-4 p-3 rounded bg-blue-100 dark:bg-[#102840] text-blue-800 dark:text-blue-200 text-sm">
        💡 Tip: {randomTip}
      </div>

      {/* Participant Selection */}
      <div>
        <p className="font-medium mb-2">Select Participants</p>
        <div className="flex gap-4 flex-wrap">
          {participantTypes.map((p) => (
            <button
              key={p.value}
              onClick={() => toggleType(p.value)}
              className={`px-3 py-1 rounded border ${
                selectedTypes.includes(p.value)
                  ? "bg-accent text-white"
                  : "bg-white dark:bg-[#122031]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Student Subcategories */}
      {selectedTypes.includes("students") && (
        <div>
          <p className="font-medium mb-2">Student Subcategories</p>
          <div className="flex gap-3 flex-wrap">
            {studentSubCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => toggleSubCategory(sub)}
                className={`px-3 py-1 rounded border capitalize ${
                  selectedSubCategories.includes(sub)
                    ? "bg-accent text-white"
                    : "bg-white dark:bg-[#122031]"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          {/* Subject */}
          <div>
            <p className="font-medium mb-2">Subject</p>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Email subject"
            />
          </div>

          {/* Body Editor */}
          <div>
            <p className="font-medium mb-2 mt-3">Body</p>
            <div className="w-full max-h-[90vh] border rounded overflow-y-auto">
              <Editor
                value={body}
                onValueChange={(code) => setBody(code)}
                highlight={(code) =>
                  Prism.highlight(code, Prism.languages.html, "html")
                }
                padding={12}
                className="font-mono text-sm min-h-full"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <p className="font-medium mb-2">Preview</p>
          <div
            className="border max-h-[100vh] overflow-y-scroll rounded p-3 bg-white dark:bg-[#122031] min-h-[150px]"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </div>
      </div>

      {/* Send Button with Confirmation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            disabled={sending}
            className="px-6 py-2 rounded bg-accent text-black hover:scale-[1.01] disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send Emails"}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white dark:bg-[#122031]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will send emails to the selected participants and will consume
              your email quota.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={sending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={sending} onClick={handleSend}>
              Confirm & Send
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
