





import { ReactNode } from "react";

interface FormWrapperProps {
  title?: string;
  classname ?: string;
  verse?: string;
  aayat?: string;
  step: number;
  totalSteps: number;
  children: ReactNode;
  showProgress?: boolean;   // keeps old usage
  hideProgress?: boolean;   // NEW: hide progress if true
}


export default function FormWrapper({
  classname="max-w-3xl",
  title,
  verse,
  aayat,
  step,
  totalSteps,
  hideProgress,
  children,
  showProgress = true,
}: FormWrapperProps) {
  return (
    <div className={`w-full ${classname} bg-white text-center rounded-2xl p-4 `}>
      {/* Header */}
      {aayat && <p className="text-2xl md:text-3xl my-2 text-accent">{aayat}</p>}
      {title && <p className="text-2xl md:text-3xl my-2 text-primary font-merriweather font-semibold">{title}</p>}
      {verse && <p className="text-base text-gray-500">{verse}</p>}

      {/* Progress Bar */}
      {/* Progress Bar */}
      {showProgress && !hideProgress && (
        <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden my-4 gap-[5px]">
          {[...Array(totalSteps)].map((_, i) => {
            const fillPercent = i < step ? 100 : 0;
            return (
              <div key={i} className="flex-1 bg-gray-300 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            );
          })}
        </div>
      )}


      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
