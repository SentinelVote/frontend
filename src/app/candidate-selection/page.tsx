"use client";
import React, { useState } from "react";

type Candidate = {
  id: string;
  name: string;
  independent: boolean;
};

const candidates: Candidate[] = [
  { id: "1", name: "Tharman Shanmugaratnam", independent: true },
  { id: "2", name: "Ng Kok Song", independent: true },
  { id: "3", name: "Tan Kin Lian", independent: true },
];

const CandidateSelection: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex justify-center items-center p-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">
          Candidate Selection for Presidential Election
        </h1>
        <div className="p-8 rounded-lg w-full">
          <div className="grid grid-cols-3 gap-4">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white h-[400px] w-[320px] rounded-lg text-center"
              >
                <div className="bg-slate-500 bg-center bg-contain bg-no-repeat h-[80%] w-full rounded-t-lg mb-2"></div>
                <div className="flex px-6 gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                  />
                  <div className="flex flex-col text-left">
                    <h2 className="text-lg font-semibold mt-2 text-slate-900">
                      {candidate.name}
                    </h2>
                    {candidate.independent && (
                      <p className="text-sm text-gray-600">Independent</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4
                 focus:ring-red-300 font-medium rounded-lg text-sm self-center px-5 py-2.5
                 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 mt-24"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateSelection;
