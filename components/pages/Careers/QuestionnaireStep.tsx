import React from "react";

interface QuestionnaireStepProps {
  data: any;
  onChange: (field: string, value: any) => void;
  errors: any;
}

const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div>
        <label className="block mb-2 text-gray-700">Introduce yourself?</label>
        <textarea
          placeholder="Introduce yourself (150–300 letters)"
          value={data.intro}
          onChange={(e) => onChange("intro", e.target.value)}
          className="w-full border rounded-lg p-3"
        />
        {errors.intro && <p className="text-red-500 text-sm">{errors.intro}</p>}
      </div>

      {/* Teaching exp */}
      <div>
        <label className="block mb-2 text-gray-700">Have you taught foreign students before?</label>
        <textarea
          placeholder="Explain (100–300 letters)"
          value={data.taughtBefore}
          onChange={(e) => onChange("taughtBefore", e.target.value)}
          className="w-full border rounded-lg p-3"
        />
        {errors.taughtBefore && <p className="text-red-500 text-sm">{errors.taughtBefore}</p>}
      </div>

      {/* English skills */}
      <div>
        <label className="block mb-2 text-gray-700">How much do you rate your English communication skills?</label>
        <div className="flex space-x-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <label key={num} className="flex items-center space-x-1">
              <input
                type="radio"
                name="englishRating"
                value={num}
                checked={data.englishRating === String(num)}
                onChange={(e) => onChange("englishRating", e.target.value)}
                className="w-6 h-6 accent-primary"  
              />
              <span>{num}</span>
            </label>
          ))}
        </div>
        {errors.englishRating && <p className="text-red-500 text-sm">{errors.englishRating}</p>}
      </div>

      <div>
        <label className="block mb-2 text-gray-700">Explain your above English communication rating.</label>
        <textarea
          placeholder="Explain (100–300 letters)"
          value={data.englishExplain}
          onChange={(e) => onChange("englishExplain", e.target.value)}
          className="w-full border rounded-lg p-3"
        />
        {errors.englishExplain && <p className="text-red-500 text-sm">{errors.englishExplain}</p>}
      </div>

      {/* Quranic skills */}
      <div>
        <label className="block mb-2 text-gray-700">How much do you rate your Quranic education skills?</label>
        <div className="flex space-x-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <label key={num} className="flex items-center space-x-1">
              <input
                type="radio"
                name="quranRating"
                className="w-6 h-6 accent-primary"
                value={num}
                checked={data.quranRating === String(num)}
                onChange={(e) => onChange("quranRating", e.target.value)}
              />
              <span>{num}</span>
            </label>
          ))}
        </div>
        {errors.quranRating && <p className="text-red-500 text-sm">{errors.quranRating}</p>}
      </div>

      <div>
        <label className="block mb-2 text-gray-700">Explain your above Quranic education rating.</label>
        <textarea
          placeholder="Explain (100–300 letters)"
          value={data.quranExplain}
          onChange={(e) => onChange("quranExplain", e.target.value)}
          className="w-full border rounded-lg p-3"
        />
        {errors.quranExplain && <p className="text-red-500 text-sm">{errors.quranExplain}</p>}
      </div>
    </div>
  );
};

export default QuestionnaireStep;
