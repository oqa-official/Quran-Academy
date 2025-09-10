'use client';


export default function DashboardHeader({title}: {title?: string}) {

  return (
    <header className="container px-10 max-md:px-20 bg-gray-300 shadow-md  p-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold ">
        {title || 'Dashboard'}
      </h1>
      <div className="flex items-center gap-4">
          <button className="font-bold text-gray-600 hover:text-black">
            Logout
          </button>
      </div>
    </header>
  );
}
