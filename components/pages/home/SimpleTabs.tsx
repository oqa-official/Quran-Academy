"use client";
import { useState } from "react";

export default function SimpleTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Tab One", "Tab Two", "Tab Three"];

  return (
    <div className="flex space-x-4 justify-center">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          className={`
            px-6 py-2 rounded-xl font-medium transition-colors duration-200
            ${activeTab === index 
              ? "bg-primary text-white" 
              : "bg-white text-navy border border-navy"}
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
