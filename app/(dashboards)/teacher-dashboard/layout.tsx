"use client";

import React from "react";
import { ThemeProvider } from "@/components/global/theme-provider";
import NextTopLoader from "nextjs-toploader";
import RestrictedUsers from "@/components/pages/(dashboards)/Admin-Dashboard/Restricted-Users";
import { SidebarProvider } from "../admin_dashboard/componnets/sidebar-context";
import { Sidebar } from "../admin_dashboard/componnets/Sidebar";
import { Header } from "../admin_dashboard/componnets/Header";
import { DirtyFormProvider } from "@/context/DirtyFormContext";

function Teacher_layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <DirtyFormProvider>
        <RestrictedUsers allowedRoles={["instructor"]}>
          <ThemeProvider storageKey="admin-theme" attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SidebarProvider>
              <NextTopLoader color="#5750F1" showSpinner={false} />

              <div className="flex min-h-screen">
                <Sidebar role="teacher" />

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
      </DirtyFormProvider>
    </html>
  );
}

export default Teacher_layout;
