// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { CircleX, CrossIcon } from "lucide-react";
// // Assuming you have a custom utility function, please update the path if needed

// export default function Page() {
//   const [onboardingLink, setOnboardingLink] = useState<string | null>(null);

//   useEffect(() => {
//     // This code runs only on the client side after the component has mounted
//     if (typeof window !== "undefined") {
//       const storedLink = localStorage.getItem("onboardingLink");
//       setOnboardingLink(storedLink);
//     }
//   }, []);

//   return (
//     <div className="relative min-h-screen flex justify-center items-center">
//       {/* 🔹 Background Overlay */}
//       <div
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
//         style={{ backgroundImage: "url('/assets/home/pattern.png')" }}
//       ></div>
//       <div className="w-full max-w-2xl bg-white text-center rounded-2xl p-4 relative z-10">
//         <Link href={'/'}>
//         <div>
//           <CircleX className="absolute top-2 right-2 hover:scale-105"/>
//         </div>
//         </Link>
//         {/* Header */}
//         <>
//           <p className="text-2xl md:text-3xl my-2 text-accent">
//             خَيْرُکُم مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
//           </p>
//           <p className="text-2xl md:text-3xl my-2 text-primary font-merriweather font-semibold">
//             We have received your inquiry.
//           </p>
//         </>

//         <img
//           src={"/assets/home/arrow.png"}
//           alt="arrow"
//           className="max-w-[200px] mx-auto"
//         />

//         <div className="flex flex-col items-center space-y-4 mt-6">
//           <img
//             src="/assets/home/pricing2.png"
//             alt="success"
//             className="w-32 mx-auto"
//           />
//           <p className="text-lg font-normal text-gray-700">
//             We have recieved your inquiry
//             <br /> Now Start your free trail by filling the onboarding form
//           </p>
          
//           {onboardingLink ? (
//             <Link
//               href={(onboardingLink)}
//               className=" hover:underline text-accent"
//             >
              
//             </Link>
//           ) : (
//             <p className="text-gray-500">Loading onboarding link...</p>
//           )}

//           <Link href={onboardingLink ? onboardingLink : "#"}>
//             <button
//               className="px-4 py-2 rounded-sm bg-primary text-white hover:bg-accent"
//             >
//               Start Onboarding Now
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
















"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CircleX } from "lucide-react"

export default function Page() {
  const [onboardingLink, setOnboardingLink] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLink = localStorage.getItem("onboardingLink")

      if (storedLink) {
        setOnboardingLink(storedLink)

        // 🔹 Extract ID from link (/onboarding/12345 → 12345)
        const id = storedLink.split("/").pop()

        if (id) {
          fetch(`/api/db/inquire/${id}`)
            .then((res) => res.json())
            .then((data) => {
              if (data?.name) setName(data.name)
            })
            .catch((err) =>
              console.error("Failed to fetch onboarding data:", err)
            )
        }
      }
    }
  }, [])

  return (
    <div className="relative min-h-screen flex justify-center items-center">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/assets/home/pattern.png')" }}
      ></div>

      <div className="w-full max-w-2xl bg-white text-center rounded-2xl p-6 relative z-10 shadow-lg">
        {/* Close button */}
        <Link href={"/"}>
          <CircleX className="absolute top-3 right-3 hover:scale-105 transition-transform" />
        </Link>

        {/* Quran Ayah */}
        <p className="text-2xl md:text-3xl my-2 text-accent">
          خَيْرُكُم مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
        </p>

        {/* Personalized Heading */}
        <p className="text-2xl md:text-3xl my-4 text-primary font-merriweather font-semibold">
          {name
            ? `Welcome ${name}, your journey begins here!`
            : "We’re excited to have you join us!"}
        </p>

        <img
          src={"/assets/home/arrow.png"}
          alt="arrow"
          className="max-w-[200px] mx-auto"
        />

        {/* Main Content */}
        <div className="flex flex-col items-center space-y-4 mt-6">
          <img
            src="/assets/home/pricing2.png"
            alt="success"
            className="w-32 mx-auto"
          />

          <p className="text-lg font-normal text-gray-700">
            {name
              ? `${name}, your free trial is ready!`
              : "Your free trial is ready!"}
            <br />
            Complete your onboarding form to start learning today.
          </p>

          {/* CTA */}
          {onboardingLink ? (
            <Link href={onboardingLink}>
              <button className="px-6 py-3 rounded-md bg-primary text-white font-medium hover:bg-accent transition-colors">
                Start Onboarding Now
              </button>
            </Link>
          ) : (
            <p className="text-gray-500">Preparing your onboarding link...</p>
          )}
        </div>
      </div>
    </div>
  )
}
