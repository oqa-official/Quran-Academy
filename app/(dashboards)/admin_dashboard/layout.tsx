"use client";

import React from "react";
import { ThemeProvider } from "@/components/global/theme-provider";
import { SidebarProvider } from "./componnets/sidebar-context";
import { Sidebar } from "./componnets/Sidebar";
import { Header } from "./componnets/Header";
import NextTopLoader from "nextjs-toploader";
import RestrictedUsers from "@/components/pages/(dashboards)/Admin-Dashboard/Restricted-Users";
import { DirtyFormProvider } from "@/context/DirtyFormContext";

function Admin_layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <DirtyFormProvider>
    <RestrictedUsers allowedRoles={["admin"]}>
      <ThemeProvider  storageKey="admin-theme"  attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>

        <SidebarProvider>
          <NextTopLoader color="#5750F1" showSpinner={false} />

          <div className="flex min-h-screen">
            <Sidebar role="admin"/>

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

export default Admin_layout;
