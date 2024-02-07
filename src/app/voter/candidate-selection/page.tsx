"use client";
import { GetCookie } from "@/app/globals";
import candidateNKS from "@public/candidate_nks.jpg";
import candidateTKL from "@public/candidate_tkl.jpg";
import candidateTS from "@public/candidate_ts.jpg";
import exitIconSvg from "@public/exit_icon.svg";
import warningIconSvg from "@public/warning_icon.svg";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FabricAuthorizationToken } from "@/app/globals";

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
  {
    id: "2",
    name: "Ng Kok Song",
    independent: true,
    image: candidateNKS,
  },
  {
    id: "3",
    name: "Tan Kin Lian",
    independent: true,
    image: candidateTKL,
  },
];

type ConfirmationModalProps = {
  isOpen: boolean;
  candidateName: string;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  candidateName,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const privateKeyURI = GetCookie("privateKey");
  console.log("privateKeyURI:\n", privateKeyURI);
  let privateKey = "";
  if (!!privateKeyURI) {
    privateKey = decodeURIComponent(privateKeyURI);
  } else {
    console.log("User has no private key.");
  }

  const email = GetCookie("user_email");
  const constituency = GetCookie("user_constituency");

  const handleConfirm = async () => {
    let response: Response;
    const DEBUG = process.env.NODE_ENV === "development";
    try {

      console.log("Fetching folded public keys...")
      response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/fabric/folded-public-keys`,
        {
          method: "GET",
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch folded public keys.");
      const foldedPublicKeys = await response.text();
      DEBUG && console.log("Folded public keys:\n", foldedPublicKeys);

      console.log("Generating linkable ring signature...")
      response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/lrs/sign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: candidateName,
            privateKeyContent: privateKey,
            foldedPublicKeys: foldedPublicKeys,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to generate linkable ring signature.");
      const { signature } = await response.json();
      DEBUG && console.log("Linkable ring signature:\n", signature);

      const voteStartTime = 8; // the election starts at 8am
      const voteEndTime = 18; // the election ends at 6pm
      const hour = process.env.NODE_ENV === "production"
          ? new Date().getHours()
          : Math.floor(Math.random() * (voteEndTime - voteStartTime + 1)) + voteStartTime;

      response = await fetch(
        `${process.env.NEXT_PUBLIC_FABRIC_URL}/invoke/vote-channel/SentinelVote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await FabricAuthorizationToken()}`,
          },
          body: JSON.stringify({
            "method": "KVContractGo:PutVote",
            "args":   [
              JSON.stringify({
                vote: candidateName,
                voteSignature: signature,
                constituency: constituency,
                hour: hour,
              }),
            ],
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to submit vote.");

      response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/voter/has-voted`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            hasVoted: true,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update hasVoted status.");

    } catch (err) {
      console.error(err);
      alert(`${err}`);
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
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            id={"confirm-vote"}
            onClick={() => {
              onConfirm();
              handleConfirm().then(() => window.location.href = "/voter/success");
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const CandidateSelectionPage: React.FC = () => {
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
    <main
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
      <span className="text-lg font-normal text-left text-white">
        for Presidential Election
      </span>
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
                  id={candidate.id}
                  checked={selectedCandidateId === candidate.id}
                  onChange={() => handleCheckboxChange(candidate.id)}
                  className="form-checkbox text-blue-600 rounded focus:ring-blue-500"
                />
                <label hidden={true} htmlFor={candidate.id}>
                  {candidate.name}
                </label>
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
        id={"submit-vote"}
        onClick={() => setShowConfirmation(true)}
        className="text-gray-900 bg-white border border-gray-300 w-fit self-center
      focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg
      text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600
      dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
      >
        Submit Vote
      </button>
    </main>
  );
};

export default CandidateSelectionPage;
