import React from "react";

interface FormNavigationProps {
  step: number;
  totalSteps: number;
  loading? : boolean,
  onNext: () => void;
  onPrev: () => void;
  onSubmit?: () => void; // ✅ add this
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  step,
  loading, 
  totalSteps,
  onNext,
  onPrev,
  onSubmit,
}) => {
  return (
    <div className="flex justify-between mt-6">
      {step > 1 && (
        <button
          type="button"
          onClick={onPrev}
          className="px-4 py-2 border rounded bg-gray-200"
        >
          Previous
        </button>
      )}

      {step < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          className="ml-auto px-4 py-2 border rounded bg-primary text-white"
        >
          Next
        </button>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={onSubmit} // ✅ will now work
          className="ml-auto px-4 py-2 border rounded bg-primary disabled:cursor-not-allowed text-white"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      )}
    </div>
  );
};

export default FormNavigation;
