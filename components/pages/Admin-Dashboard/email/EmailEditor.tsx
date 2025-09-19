"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDirtyForm } from "@/context/DirtyFormContext";
import { useRouter } from "next/navigation";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism.css"; // or prism-okaidia.css for dark

type EmailEditorProps = {
  template: {
    _id: string;
    event: string;
    subject: string;
    bodyHtml: string;
  };
  requiredFields: string[];
};

export default function EmailEditor({ template, requiredFields }: EmailEditorProps) {
  const [subject, setSubject] = useState(template.subject);
  const [code, setCode] = useState(template.bodyHtml);
  const [saving, setSaving] = useState(false);

  const { setDirty } = useDirtyForm();
  const router = useRouter();

  // detect changes compared to initial template
  const isChanged = subject !== template.subject || code !== template.bodyHtml;

  useEffect(() => {
    setDirty(isChanged);
  }, [isChanged, setDirty]);

  function validateTemplate() {
    for (const field of requiredFields) {
      if (!subject.includes(`{{${field}}}`) && !code.includes(`{{${field}}}`)) {
        toast.error(`Missing required field: {{${field}}}`);
        return false;
      }
    }
    return true;
  }

  async function handleSave() {
    if (!isChanged) return;
    if (!validateTemplate()) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/email/${template._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: template.event,
          subject,
          bodyHtml: code,
        }),
      });
      if (!res.ok) throw new Error("Failed to update template");

      toast.success("Template updated successfully!");
      setDirty(false);
      router.push("/admin_dashboard"); // ✅ redirect after save
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update template");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Note for admin */}
      <div className="mb-4 p-3 rounded bg-yellow-100 dark:bg-[#020D1A] text-yellow-800 dark:text-accent text-sm">
        ⚠️ Required fields:{" "}
        {requiredFields.map((f) => (
          <code key={f} className="bg-yellow-200 dark:bg-[#353535] px-1 rounded mx-1">
            {"{{"}{f}{"}}"}
          </code>
        ))}
        . These must appear in <b>subject</b> or <b>body</b>.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Editor */}
        <div>


          <h2 className="font-medium mb-2">Edit HTML</h2>
         <div className="rounded-sm overflow-hidden shadow-lg dark:shadow-[#ffffff0f]">
           <div className="w-full h-[500px] border rounded overflow-y-auto">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                Prism.highlight(code, Prism.languages.html, "html")
              }
              padding={12}
              className="font-mono text-sm min-h-full"
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 14,
              }}
            />
          </div>
         </div>


          <button
            onClick={handleSave}
            disabled={saving || !isChanged}
            className="mt-3 px-4 py-2 bg-accent rounded hover:scale-[1.01] text-black disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Preview */}
        <div>
          <h2 className="font-medium mb-2">Preview</h2>

         <div className="bg-white p-3 rounded-md dark:bg-[#122031]">
           <div className="">
            <p className="font-medium mb-2 text-accent">Subject</p>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border rounded p-2 mb-4"
              placeholder="Email subject"
            />
          </div>
          
          <div
            className="border rounded bg-white dark:dark:bg-[#122031] h-[500px] overflow-auto max-h-[600px]"
            dangerouslySetInnerHTML={{ __html: code }}
          />
         </div>
        </div>
      </div>
    </div>
  );
}
