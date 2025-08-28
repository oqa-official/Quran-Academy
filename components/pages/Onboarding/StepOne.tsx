import { useState } from "react";
import FormWrapper from "./FormWrapper";

const levelOptions = [
  {
    key: "basic",
    name: "Basic",
    desc: "Start from the very beginning with fundamentals.",
    img: "/assets/home/pricing1.png",
  },
  {
    key: "intermediate",
    name: "Intermediate",
    desc: "Build upon your foundation and go deeper.",
    img: "/assets/home/pricing2.png",
  },
  {
    key: "advanced",
    name: "Advanced",
    desc: "Master complex topics and become an expert.",
    img: "/assets/home/pricing3.png",
  },
];

export default function StepOne({ formData, setFormData, goNext }: any) {
  const [selectedUser, setSelectedUser] = useState(formData.userType);
  const [selectedLevel, setSelectedLevel] = useState(formData.level);

  const handleNext = () => {
    setFormData({ ...formData, userType: selectedUser, level: selectedLevel });
    goNext();
  };

  const isDisabled = !selectedUser || !selectedLevel;

  return (
    <FormWrapper
      title="Let’s Get Started"
      verse="Choose who this program is for and select the level."
      aayat="بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"
      step={0}
      totalSteps={3}

    >
      {/* User type selection (checkboxes) */}
      <div className="flex gap-6 justify-center">
        {["myself", "child"].map((type) => (
          <label key={type} className="flex flex-col md:flex-row items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedUser === type}
              onChange={() => setSelectedUser(type)}
              className="w-5 h-5 accent-accent"
            />
            <span className="capitalize">
              {type === "myself" ? "For Myself" : "For My Child"}
            </span>
          </label>
        ))}
      </div>

      {/* Level selection cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        {levelOptions.map((lvl) => (
          <div
            key={lvl.key}
            onClick={() => setSelectedLevel(lvl.key)}
            className={`cursor-pointer border rounded-xl overflow-hidden shadow-sm transition-all ${selectedLevel === lvl.key
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-800 hover:shadow-md"
              }`}
          >
            {/* Image */}
            <img
              src={lvl.img}
              alt={lvl.name}
              className={`mx-auto h-32 p-3 object-cover transition-all ${selectedLevel === lvl.key ? "grayscale-0" : "grayscale"
                }`}
            />

            {/* Content */}
            <div className="p-4 text-center">
              <h3 className="font-semibold text-lg">{lvl.name}</h3>
              <p className="text-sm mt-1">{lvl.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Next button */}
      <button
        className={`mt-6 w-full py-2 rounded-lg font-semibold ${isDisabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-primary text-white hover:bg-accent"
          }`}
        disabled={isDisabled}
        onClick={handleNext}
      >
        Next
      </button>
    </FormWrapper>
  );
}
