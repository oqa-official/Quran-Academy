import React from "react";

const PersonalVerificationStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <label className=" block mb-2 text-gray-700">Email</label>
        <input
          type="email"
          className="w-full border rounded-lg p-3"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label className=" block mb-2 text-gray-700">Personal Identity card (Front side)</label>
        <input type="file" className="w-full border rounded-lg p-2 text-gray-400" />
      </div>

      <div>
        <label className=" block mb-2 text-gray-700">Personal Identity card (Back side)</label>
        <input type="file" className="w-full border rounded-lg p-2 text-gray-400" />
      </div>

      <div>
        <label className=" block mb-2 text-gray-700">Quranic Certificate</label>
        <input type="file" className="w-full border rounded-lg p-2 text-gray-400" />
      </div>

      <div>
        <label className=" block mb-2 text-gray-700">Last Educational Certificate</label>
        <input type="file" className="w-full border rounded-lg p-2 text-gray-400" />
      </div>

      <div>
        <input type="checkbox" id="captcha" />{" "}
        <label htmlFor="captcha">I’m not a robot</label>
      </div>
    </div>
  );
};

export default PersonalVerificationStep;
