"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", students: 40, teachers: 8 },
  { month: "Feb", students: 60, teachers: 10 },
  { month: "Mar", students: 75, teachers: 12 },
  { month: "Apr", students: 90, teachers: 15 },
  { month: "May", students: 120, teachers: 20 },
  { month: "Jun", students: 150, teachers: 22 },
];

export default function Analytics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      {/* Line Chart */}
      <div className="bg-white dark:bg-[#122031] p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          Student Growth
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" stroke="currentColor" />
            <YAxis stroke="currentColor" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="students"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-[#122031] p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          Teacher Onboarding
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" stroke="currentColor" />
            <YAxis stroke="currentColor" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                color: "#fff",
              }}
            />
            <Legend />
            <Bar dataKey="teachers" fill="#F4B400" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
