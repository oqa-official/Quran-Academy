
import { ReactNode } from "react";

interface FormWrapperProps {
  title?: string;
  verse?: string;
  aayat?: string;
  step: number;
  totalSteps: number;
  children: ReactNode;
  progress?: number; // ✅ added
}

export default function FormWrapper({
  title,
  verse,
  aayat,
  step,
  totalSteps,
  children,
  progress,
}: FormWrapperProps) {
  return (
    <div className="w-full max-w-2xl bg-white text-center  rounded-2xl p-2">
      {/* Header Section */}
      {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
      {verse && <p className="text-base text-gray-500">{verse}</p>}
      {aayat && <p className="text-2xl my-2 text-accent">{aayat}</p>}

      {/* ✅ Progress Bar */}
      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2 m-1">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}


      {/* Actual Content */}
      <div>{children}</div>
    </div>
  );
}
