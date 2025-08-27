import React from "react";

interface Props {
  step: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
}

const FormNavigation: React.FC<Props> = ({ step, totalSteps, onNext, onPrev }) => {
  return (
    <div className="mt-8 flex justify-between">
      {step > 1 ? (
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-2 rounded-md border bg-gray-200 hover:bg-gray-300"
        >
          Back
        </button>
      ) : (
        <span />
      )}

      {step < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 rounded-md bg-primary text-white hover:bg-primary-hover"
        >
          Next
        </button>
      ) : (
        <button
          type="submit"
          className="px-6 py-2 rounded-md bg-primary text-white hover:bg-primary-hover"
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default FormNavigation;
