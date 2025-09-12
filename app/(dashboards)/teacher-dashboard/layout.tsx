import AdminHeader from "@/components/pages/Admin-Dashboard/AdminHeader";
import Sidebar from "@/components/pages/Admin-Dashboard/AdminSidebar";
import RestrictedUsers from "@/components/pages/Admin-Dashboard/Restricted-Users";
import {  teacherLinks } from "@/lib/constants/data";


export default function StudentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RestrictedUsers allowedRoles={["instructor"]}>
    <div className={`flex  bg-white`}>
     <Sidebar links={teacherLinks} dashboardName="Teacher Dashboard" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
     </RestrictedUsers>
  );
}
