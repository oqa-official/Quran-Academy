import { useState } from "react";
import FormWrapper from "./FormWrapper";

export default function StepTwo({ formData, setFormData, goNext, goBack }: any) {
  const [inputs, setInputs] = useState({
    studentCount: formData.studentCount || 1,
    teacherPref: formData.teacherPref || "",
  });

  const handleChange = (e: any) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setFormData({ ...formData, ...inputs });
    goNext();
  };

  const isDisabled = !inputs.teacherPref;

  return (
    <FormWrapper
      title="Your Details"
      verse="Please provide your information and preferences."
      aayat="ٱلْـحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ"
      step={2}
      totalSteps={5}
            hideProgress={true}

    >
      {/* Student count */}
      <div className="mb-6">
        <label className="block text-start text-base mb-2">
          How many students will join?
        </label>
        <div className="flex gap-3 justify-start">
          {[1, 2, 3, 4, 5].map((num) => (
            <label
              key={num}
              className={`flex items-center text-xs justify-center w-10 h-10 p-3 rounded-full cursor-pointer border transition ${
                inputs.studentCount === String(num)
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="studentCount"
                value={num}
                checked={inputs.studentCount === String(num)}
                onChange={handleChange}
                className="hidden"
              />
              {num}
            </label>
          ))}
        </div>
      </div>

      {/* Teacher preference */}
      <div>
        <label className="block mb-2 text-start">Teacher Preference</label>
        <div className="grid grid-cols-2 gap-6">
          {["male", "female"].map((pref) => (
            <div
              key={pref}
              onClick={() => setInputs({ ...inputs, teacherPref: pref })}
              className={`cursor-pointer border rounded-xl overflow-hidden shadow-sm transition-all ${
                inputs.teacherPref === pref
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-800 hover:shadow-md"
              }`}
            >
              <div className="w-32 flex flex-col-reverse mx-auto pt-2 items-center justify-center">
                <img
                  src={pref === "male" ? "/assets/onboard/man.png" : "/assets/onboard/woman.png"}
                  alt={pref}
                  className={`-mb-2 transition-all ${
                    inputs.teacherPref === pref ? "grayscale-0" : "grayscale"
                  }`}
                />
                <h3 className="font-semibold text-lg capitalize">{pref}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button className="px-4 py-2 rounded-sm bg-gray-200 hover:bg-gray-400" onClick={goBack}>
          Back
        </button>
        <button
          className={`px-4 py-2 rounded-sm font-medium ${
            isDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-primary text-white hover:bg-accent"
          }`}
          disabled={isDisabled}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </FormWrapper>
  );
}
