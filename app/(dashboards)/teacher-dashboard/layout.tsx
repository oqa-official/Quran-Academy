// import AdminHeader from "@/components/pages/Admin-Dashboard/AdminHeader";
// import Sidebar from "@/components/pages/Admin-Dashboard/AdminSidebar";
// import RestrictedUsers from "@/components/pages/Admin-Dashboard/Restricted-Users";
// import {  teacherLinks } from "@/lib/constants/data";


// export default function StudentLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <RestrictedUsers allowedRoles={["instructor"]}>
//     <div className={`flex  bg-white`}>
//      <Sidebar links={teacherLinks} dashboardName="Teacher Dashboard" />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col bg-white">
//         <AdminHeader />
//         <main className="flex-1 p-6 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//      </RestrictedUsers>
//   );
// }














"use client";

import React from "react";
import { ThemeProvider } from "@/components/global/theme-provider";
import NextTopLoader from "nextjs-toploader";
import RestrictedUsers from "@/components/pages/Admin-Dashboard/Restricted-Users";
import { SidebarProvider } from "../admin_dashboard/componnets/sidebar-context";
import { Sidebar } from "../admin_dashboard/componnets/Sidebar";
import { Header } from "../admin_dashboard/componnets/Header";

function Teacher_layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
    <RestrictedUsers allowedRoles={["instructor"]}>
      <ThemeProvider  storageKey="admin-theme"  attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>

        <SidebarProvider>
          <NextTopLoader color="#5750F1" showSpinner={false} />

          <div className="flex min-h-screen">
            <Sidebar role="teacher"/>

            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
              <Header />
              <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </RestrictedUsers>
    </html>
  );
}

export default Teacher_layout;
