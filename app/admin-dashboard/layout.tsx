import AdminHeader from "@/components/pages/Admin-Dashboard/AdminHeader";
import Sidebar from "@/components/pages/Admin-Dashboard/AdminSidebar";
import RestrictedUsers from "@/components/pages/Admin-Dashboard/Restricted-Users";


export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RestrictedUsers>
    <div className={` flex h-screen `}>
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 bg-white p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
     </RestrictedUsers>
  );
}
