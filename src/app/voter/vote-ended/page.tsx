"use client";
import { ClearCookies } from "@/app/globals";
import { Nominee } from "@/types/nominee";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
type votingDetailsType = {
  countCandidate: any;
  countConstituency: any;
  countHour: Number[];
  countTotal: Number;
};

export default function SuccessPage() {
  const handleExit = () => {
    ClearCookies();
    window.close();
  };
  const initialVotingDetails: votingDetailsType = {
    countCandidate: 0,
    countConstituency: {},
    countHour: [],
    countTotal: 0,
  };

  const [votingDetails, setVotingDetails] =
    useState<votingDetailsType>(initialVotingDetails);

  const getVotingDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/fabric/vote`
      );
      const data = await response.json();
      setVotingDetails(data);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getVotingDetails();
  }, []);
  const nominees: Nominee[] = [
    {
      name: "Tharman Shanmugaratnam",
      party: "Independent",
      voteCount: votingDetails?.countCandidate["Tharman Shanmugaratnam"] || 0,
      color: "#2563EB",
    },
    {
      name: "Tan Kin Lian",
      party: "Independent",
      voteCount: votingDetails?.countCandidate["Tan Kin Lian"] || 0,
      color: "#FB923C",
    },
    {
      name: "Ng Kok Song",
      party: "Independent",
      voteCount: votingDetails?.countCandidate["Ng Kok Song"] || 0,
      color: "#C084FC",
    },
  ];
  const sortedNominees = [...nominees].sort(
    (a, b) => b.voteCount - a.voteCount
  );

  const totalVotes = nominees.reduce((acc, nominee) => {
    return acc + nominee.voteCount;
  }, 0);
  return (
    <>
      <main
        className="flex flex-col items-center justify-between p-24 bg-gradient-to-r from-slate-900 to-slate-700 text-slate-900"
        style={{
          minHeight: "92vh",
          overflow: "hidden",
          justifyContent: "center",
        }}
      >
        <div className="flex  w-full text-white justify-center">
          <div className="flex flex-col">
            <div className="flex flex-col align-center gap-2">
              <h1 className="font-bold text-5xl">Voting has ended.</h1>
              <p className="font-medium text-lg">
                Thank you for participating in SentinelVote.
              </p>
              <div className="border border-gray-300 bg-white rounded-lg p-4">
                <h1 className="font-medium text-5x text-slate-900 mb-2">
                  Total votes: {totalVotes.toLocaleString() || 0} votes
                </h1>
                <div
                  style={{
                    width: "580px",
                    minHeight: "270px",
                    borderRadius: "10px",
                  }}
                >
                  <div className="flex justify-between p-2 font-normal text-gray-500">
                    <span className="text-sm ">No.</span>
                    <span className="text-sm">Nominee</span>
                    <span className="text-sm ml-16">Party</span>
                    <span className="text-sm">Total Count</span>
                  </div>
                  {sortedNominees.map((nominee, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between my-2 p-2 border rounded-md text-slate-900 shadow-md"
                    >
                      <span className="text-md text-gray-500 ml-2">
                        {idx + 1}
                      </span>

                      <div className="flex items-center w-[180px] font-normal">
                        <div
                          className="flex-shrink-0 h-12 w-12 overflow-hidden rounded-full border border-black mr-4 "
                          style={{
                            opacity: "0.9",
                            backgroundColor: nominee.color,
                          }}
                        >
                          <Image
                            src="/user.svg"
                            alt="profile"
                            width="10"
                            height="10"
                            className="h-full w-full"
                          />
                        </div>
                        <div>
                          <span className="text-sm">{nominee.name}</span>
                        </div>
                      </div>
                      <span className="text-sm">{nominee.party}</span>
                      <span className="text-sm">
                        {nominee.voteCount.toLocaleString() || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/" className="self-center">
              <button
                type="button"
                onClick={handleExit}
                className="text-gray-900 bg-white border border-gray-300 mt-10 w-[150px] self-center
      focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg
      text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600
      dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Exit
              </button>
            </Link>
          </div>
        </div>
      </main>
      {/* <Link href="/singpass-login">Singpass Login</Link>
      <Link href="/candidate-selection">Candidate Selection</Link> */}
    </>
  );
}
