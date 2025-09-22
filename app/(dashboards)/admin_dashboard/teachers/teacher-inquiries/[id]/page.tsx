// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Star } from "lucide-react";

// interface TeacherData {
//     _id: string;
//     intro: string;
//     taughtBefore: string;
//     englishRating: number;
//     englishExplain: string;
//     quranRating: number;
//     quranExplain: string;
//     name: string;
//     email: string;
//     phone: string;
//     cnicFrontUrl: string;
//     cnicBackUrl: string;
//     qualificationUrl: string;
//     experienceUrl: string;
//     createdAt: string;
// }

// export default function Page() {
//     const { id } = useParams();
//     const router = useRouter();
//     const [data, setData] = useState<TeacherData | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (!id) return;

//         const fetchData = async () => {
//             try {
//                 const res = await fetch(`/api/db/teacher-inquiries/${id}`);
//                 const json = await res.json();
//                 setData(json);
//             } catch (err) {
//                 console.error("Failed to fetch:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [id]);

//     return (
//         <div className=" mx-auto p-6 space-y-6">
//             {/* Go back */}
//             <Button variant="outline" onClick={() => router.back()}>
//                 ← Go Back
//             </Button>

//             {loading ? (
//                 <div className="space-y-4">
//                     <Skeleton className="h-8 w-1/3 bg-primary  dark:bg-[#122031]" />
//                     <Skeleton className="h-6 w-2/3 bg-primary dark:bg-[#122031]" />
//                     <Skeleton className="h-64 w-full bg-primary dark:bg-[#122031]" />
//                     <Skeleton className="h-6 w-1/2 bg-primary dark:bg-[#122031]" />
//                     <Skeleton className="h-6 w-1/4 bg-primary dark:bg-[#122031]" />
//                 </div>
//             ) : data ? (
//                 <div className="space-y-6">
//                     {/* Basic Info */}
//                     <div className="bg-white dark:bg-[#122031] shadow rounded-2xl p-6 space-y-2">
//                         <h2 className="text-2xl font-semibold">{data.name}</h2>
//                         <p className="text-md text-gray-600 dark:text-gray-400">Email: <span className="text-accent">{data.email}</span></p>
//                         <p className="text-md text-gray-600 dark:text-gray-400">Phone: <span className="text-accent">{data.phone}</span></p>
//                         <p className="text-md text-gray-600 dark:text-gray-400">
//                             Created At: {new Date(data.createdAt).toLocaleDateString()}
//                         </p>
//                     </div>

//                     {/* Intro & Teaching */}
//                     <div className="grid md:grid-cols-2 gap-6">
//                         <div className="bg-white dark:bg-[#122031] shadow rounded-2xl p-6">
//                             <h3 className="font-semibold mb-2">Introduction</h3>
//                             <p className="text-md  text-gray-700 dark:text-gray-300 ">{data.intro}</p>
//                         </div>
//                         <div className="bg-white dark:bg-[#122031] shadow rounded-2xl p-6">
//                             <h3 className="font-semibold mb-2">Teaching Experience</h3>
//                             <p className="text-md  text-gray-700 dark:text-gray-300 ">{data.taughtBefore}</p>
//                         </div>
//                     </div>

//                     {/* Ratings */}
//                     <div className="grid md:grid-cols-2 gap-6">
//                         <div className="bg-white dark:bg-[#122031] shadow rounded-2xl p-6">
//                             <h3 className="font-semibold">English Rating</h3>
//                             <p className="text-accent flex gap-2"><Star className="fill-accent"/>{data.englishRating}/5</p>
//                             <p className="text-md  text-gray-700 dark:text-gray-300  ">{data.englishExplain}</p>
//                         </div>
//                         <div className="bg-white dark:bg-[#122031] shadow rounded-2xl p-6">
//                             <h3 className="font-semibold">Quran Rating</h3>
//                             <p className="text-accent flex gap-2"><Star className="fill-accent"/>{data.englishRating}/5</p>
//                             <p className="text-md  text-gray-700 dark:text-gray-300 ">{data.quranExplain}</p>
//                         </div>
//                     </div>

//                     {/* Images Section */}
//                     <div className="grid sm:grid-cols-2 gap-6">
//                         <div className="bg-white dark:bg-[#122031] shadow rounded-2xl p-4">
//                             <p className="font-medium mb-2">CNIC Front</p>
//                             <img
//                                 src={data.cnicFrontUrl}
//                                 alt="CNIC Front"
//                                 className="w-full h-64 object-cover rounded-lg"
//                             />
//                         </div>
//                         <div className="bg-white dark:bg-[#122031] shadow rounded-2xl p-4">
//                             <p className="font-medium mb-2">CNIC Back</p>
//                             <img
//                                 src={data.cnicBackUrl}
//                                 alt="CNIC Back"
//                                 className="w-full h-64 object-cover rounded-lg"
//                             />
//                         </div>
//                         <div className="bg-white dark:bg-[#122031] shadow rounded-2xl p-4">
//                             <p className="font-medium mb-2">Qualification</p>
//                             <img
//                                 src={data.qualificationUrl}
//                                 alt="Qualification"
//                                 className="w-full h-64 object-cover rounded-lg"
//                             />
//                         </div>
//                         <div className="bg-white dark:bg-[#122031] shadow rounded-2xl p-4">
//                             <p className="font-medium mb-2">Experience</p>
//                             <img
//                                 src={data.experienceUrl}
//                                 alt="Experience"
//                                 className="w-full h-64 object-cover rounded-lg"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 <p className="text-center text-gray-500">No data found.</p>
//             )}
//         </div>
//     );
// }
















"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TeacherData {
  _id: string;
  intro: string;
  taughtBefore: string;
  englishRating: number;
  englishExplain: string;
  quranRating: number;
  quranExplain: string;
  name: string;
  email: string;
  phone: string;
  cnicFrontUrl: string;
  cnicBackUrl: string;
  qualificationUrl: string;
  experienceUrl: string;
  createdAt: string;
}

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/db/teacher-inquiries/${id}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // helper to render image card with popup
  const ImageCard = ({ label, url }: { label: string; url: string }) => (
    <div className="bg-white dark:bg-[#122031] shadow rounded-2xl p-4">
      <p className="font-medium mb-2">{label}</p>
      <Dialog>
        <DialogTrigger asChild>
          <img
            src={url}
            alt={label}
            className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
          />
        </DialogTrigger>
        <DialogContent className="max-w-5xl">
          <img
            src={url}
            alt={label}
            className="w-full h-auto rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="mx-auto p-6 space-y-6">
      {/* Go back */}
      <Button variant="outline" onClick={() => router.back()}>
        ← Go Back
      </Button>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3 bg-primary dark:bg-[#122031]" />
          <Skeleton className="h-6 w-2/3 bg-primary dark:bg-[#122031]" />
          <Skeleton className="h-64 w-full bg-primary dark:bg-[#122031]" />
          <Skeleton className="h-6 w-1/2 bg-primary dark:bg-[#122031]" />
          <Skeleton className="h-6 w-1/4 bg-primary dark:bg-[#122031]" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-[#122031] shadow rounded-2xl p-6 space-y-2">
            <h2 className="text-2xl font-semibold">{data.name}</h2>
            <p className="text-md text-gray-600 dark:text-gray-400">
              Email: <span className="text-accent">{data.email}</span>
            </p>
            <p className="text-md text-gray-600 dark:text-gray-400">
              Phone: <span className="text-accent">{data.phone}</span>
            </p>
            <p className="text-md text-gray-600 dark:text-gray-400">
              Created At: {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Intro & Teaching */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#122031] shadow rounded-2xl p-6">
              <h3 className="font-semibold mb-2">Introduction</h3>
              <p className="text-md text-gray-700 dark:text-gray-300">
                {data.intro}
              </p>
            </div>
            <div className="bg-white dark:bg-[#122031] shadow rounded-2xl p-6">
              <h3 className="font-semibold mb-2">Teaching Experience</h3>
              <p className="text-md text-gray-700 dark:text-gray-300">
                {data.taughtBefore}
              </p>
            </div>
          </div>

          {/* Ratings */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#122031] shadow rounded-2xl p-6">
              <h3 className="font-semibold">English Rating</h3>
              <p className="text-accent flex gap-2">
                <Star className="fill-accent" />
                {data.englishRating}/5
              </p>
              <p className="text-md text-gray-700 dark:text-gray-300">
                {data.englishExplain}
              </p>
            </div>
            <div className="bg-white dark:bg-[#122031] shadow rounded-2xl p-6">
              <h3 className="font-semibold">Quran Rating</h3>
              <p className="text-accent flex gap-2">
                <Star className="fill-accent" />
                {data.quranRating}/5
              </p>
              <p className="text-md text-gray-700 dark:text-gray-300">
                {data.quranExplain}
              </p>
            </div>
          </div>

          {/* Images Section with popup */}
          <div className="grid sm:grid-cols-2 gap-6">
            <ImageCard label="CNIC Front" url={data.cnicFrontUrl} />
            <ImageCard label="CNIC Back" url={data.cnicBackUrl} />
            <ImageCard label="Qualification" url={data.qualificationUrl} />
            <ImageCard label="Experience" url={data.experienceUrl} />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No data found.</p>
      )}
    </div>
  );
}
