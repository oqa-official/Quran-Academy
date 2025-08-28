import React from "react";

const QuestionnaireStep: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div>
        <label className=" block mb-2 text-gray-700">Introduce yourself?</label>
        <textarea
          placeholder="Introduce yourself (150–300 letters)"
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* Teaching exp */}
      <div>
        <label className=" block mb-2 text-gray-700">Have you taught foreign students before?</label>
        <textarea
          placeholder="Explain (100–300 letters)"
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* English skills */}
      <div>
        <label className=" block mb-2 text-gray-700">How much you rate your English communication skills?</label>
        <div className="flex space-x-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <label key={num} className="flex items-center space-x-1">
              <input type="radio" name="englishRating" value={num} />
              <span>{num}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className=" block mb-2 text-gray-700">Explain your above English communication rating.</label>
        <textarea
          placeholder="Explain (100–300 letters)"
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* Quranic skills */}
      <div>
        <label className=" block mb-2 text-gray-700">How much you rate your Quranic education skills?</label>
        <div className="flex space-x-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <label key={num} className="flex items-center space-x-1">
              <input type="radio" name="quranRating" value={num} />
              <span>{num}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className=" block mb-2 text-gray-700">Explain your above Quranic education rating.</label>
        <textarea
          placeholder="Explain (100–300 letters)"
          className="w-full border rounded-lg p-3"
        />
      </div>
    </div>
  );
};

export default QuestionnaireStep;
