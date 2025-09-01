'use client';


export default function AdminHeader() {

  return (
    <header className="container px-10 bg-gray-300 shadow-md shadow-black p-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold">
        Hi Admin
      </h1>
      <div className="flex items-center gap-4">
          <button className="font-bold text-gray-600 hover:text-black">
            Logout
          </button>
      </div>
    </header>
  );
}
