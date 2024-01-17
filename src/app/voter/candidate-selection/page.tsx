"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import candidateNKS from "@public/candidate_nks.jpg";
import candidateTKL from "@public/candidate_tkl.jpg";
import candidateTS from "@public/candidate_ts.jpg";
import exitIconSvg from "@public/exit_icon.svg";
import warningIconSvg from "@public/warning_icon.svg";

type Candidate = {
  id: string;
  name: string;
  independent: boolean;
  image: any;
};

const candidates: Candidate[] = [
  {
    id: "1",
    name: "Tharman Shanmugaratnam",
    independent: true,
    image: candidateTS,
  },
  { id: "2", name: "Ng Kok Song", independent: true, image: candidateNKS },
  { id: "3", name: "Tan Kin Lian", independent: true, image: candidateTKL },
];

type ConfirmationModalProps = {
  isOpen: boolean;
  candidateName: string;
  onClose: () => void;
  onConfirm: () => void;
};

function getCookie(name: string) {
  if (document === undefined) return null;
  else {
    const cookieArray = document?.cookie.split("; ");
    const cookie = cookieArray.find((row) => row.startsWith(name + "="));
    return cookie ? cookie.split("=")[1] : null;
  }
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  candidateName,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const privateKeyURI = getCookie("privateKey");
  console.log("privateKeyURI:\n", privateKeyURI);
  let privateKey = '';
  if (!!privateKeyURI) {
    privateKey = decodeURIComponent(privateKeyURI);
  } else {
    console.log("User has no private key.");
  }

  const handleConfirm = () => {
    try {
      const response = fetch("http://localhost:3001/api/store-vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vote: candidateName, privateKey: privateKey }),
      });
      console.log("response", response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="flex flex-col justify-between bg-white p-4 rounded-lg shadow-lg text-slate-950 max-w-xl min-h-[250px] gap-2">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Image
              src={warningIconSvg}
              alt="Warning icon"
              width={20}
              height={20}
            />
            <h2 className="text-lg font-semibold">Candidate Confirmation</h2>
          </div>
          <button onClick={onClose} className="focus:outline-none">
            <Image src={exitIconSvg} alt="Exit icon" width={20} height={20} />
          </button>
        </div>
        <p className="font-bold">{`Candidate Name: ${candidateName}`}</p>
        <p>
          Once you confirm your selection, you will not be able to log in again
          or change it, and your vote will be immediately submitted. Please
          review your choice carefully to ensure it reflects your decision.
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <Link href="/voter/success">
            <button
              onClick={() => {
                onConfirm();
                handleConfirm();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Confirm
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const CandidateSelection: React.FC = () => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCheckboxChange = (id: string) => {
    setSelectedCandidateId(selectedCandidateId === id ? null : id);
  };
  const getSelectedCandidateName = () => {
    return (
      candidates.find((candidate) => candidate.id === selectedCandidateId)
        ?.name || ""
    );
  };
  const handleConfirmVote = () => {
    console.log("Confirmed vote for:", getSelectedCandidateName());
    // Handle the vote confirmation logic
    setShowConfirmation(false); // Close the modal after confirmation
  };
  return (
    <div
      className="max-h-screen bg-gradient-to-r from-slate-900 to-slate-700 flex flex-col justify-center items-center p-4"
      style={{
        minHeight: "90vh",
        overflow: "hidden",
        justifyContent: "center",
      }}
    >
      <ConfirmationModal
        candidateName={getSelectedCandidateName()}
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmVote}
      />
      <h1 className="text-4xl font-bold mb-4 text-left text-white">
        Candidate Selection
      </h1>
      <h2 className="text-lg font-normal text-left text-white">
        for Presidential Election
      </h2>
      <div className="p-8 rounded-lg">
        <div className="grid grid-cols-3 gap-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white h-[500px] w-[280px] rounded-lg text-center"
            >
              <div className="bg-center bg-contain bg-no-repeat h-[80%] w-full rounded-t-lg mb-2">
                <Image
                  src={candidate.image}
                  alt={candidate.name}
                  // objectFit="contain"

                  className="rounded-t-lg"
                />
              </div>
              <div className="flex px-5 gap-2 bg-white z-50">
                <input
                  type="checkbox"
                  checked={selectedCandidateId === candidate.id}
                  onChange={() => handleCheckboxChange(candidate.id)}
                  className="form-checkbox text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex flex-col text-left">
                  <h3 className="text-font-semibold mt-2 text-slate-900">
                    {candidate.name}
                  </h3>
                  {candidate.independent && (
                    <p className="text-sm text-gray-600">Independent</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowConfirmation(true)}
        className="text-gray-900 bg-white border border-gray-300 w-fit self-center
      focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg
      text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600
      dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
      >
        Submit Vote
      </button>
    </div>
  );
};

export default CandidateSelection;
