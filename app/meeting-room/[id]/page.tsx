// "use client";

// import "@whereby.com/browser-sdk/embed";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function MeetingPage() {
//   const { id } = useParams(); // ✅ get id dynamically in client component
//   const [meeting, setMeeting] = useState<any>(null);

//   useEffect(() => {
//     const fetchMeeting = async () => {
//       if (!id) return;
//       const res = await fetch(`/api/db/meetings/${id}`, { cache: "no-store" });
//       const data = await res.json();
//       setMeeting(data);
//     };
//     fetchMeeting();
//   }, [id]);

//   if (!meeting) return <div className="p-10 text-center">Loading meeting...</div>;
//   if (!meeting.joinUrl)
//     return <div className="p-10 text-center">Meeting link not available.</div>;

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <h1 className="text-2xl font-semibold mb-4">{meeting.topic}</h1>

//       {/* Render only when joinUrl is ready */}
//       {/* @ts-ignore */}
//       <whereby-embed
//         room={meeting.joinUrl}
//         display-name="Ahmad"
//         leave-redirect="/dashboard"
//         // @ts-ignore
//         modestbranding
//         displayName={meeting.studentName || "Student"}
//         style={{
//           width: "90vw",
//           height: "80vh",
//           borderRadius: "1rem",
//           overflow: "hidden",
//           border: "1px solid #ddd",
//            backgroundColor: "#0A1F44",
//           boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
//         }}
//         // @ts-ignore
//         allow="camera; microphone; fullscreen; speaker; display-capture"
//       />
//     </div>
//   );
// }







"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MeetingPage() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState<any>(null);

  // ✅ Dynamically import the Whereby SDK on client-side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@whereby.com/browser-sdk/embed");
    }
  }, []);

  useEffect(() => {
    const fetchMeeting = async () => {
      if (!id) return;
      const res = await fetch(`/api/db/meetings/${id}`, { cache: "no-store" });
      const data = await res.json();
      setMeeting(data);
    };
    fetchMeeting();
  }, [id]);

  if (!meeting) return <div className="p-10 text-center">Loading meeting...</div>;
  if (!meeting.joinUrl)
    return <div className="p-10 text-center">Meeting link not available.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">{meeting.topic}</h1>

      {/* @ts-ignore */}
      <whereby-embed
        room={meeting.joinUrl}
        display-name="Ahmad"
        leave-redirect="/dashboard"
        /* @ts-ignore */
        modestbranding
        displayName={meeting.studentName || "Student"}
        style={{
          width: "90vw",
          height: "80vh",
          borderRadius: "1rem",
          overflow: "hidden",
          border: "1px solid #ddd",
          backgroundColor: "#0A1F44", // your theme blue
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        }}
        allow="camera; microphone; fullscreen; speaker; display-capture"
      />
    </div>
  );
}
