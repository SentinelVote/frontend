"use client";
import Link from "next/link";
import { ClearCookies } from "@/app/globals";

export default function PendingElectionPage() {
  const handleExit = () => {
    ClearCookies();
    window.close();
  };
  return (
    <>
      <main
        className="flex flex-col items-center justify-between p-24 bg-gradient-to-r from-slate-900 to-slate-700 text-slate-900"
        style={{
          minHeight: "90vh",
          overflow: "hidden",
          justifyContent: "center",
        }}
      >
        <div className="flex w-full text-white justify-center">
          <div className="flex flex-col">
            <div className="flex flex-col align-center">
              <h1 className="font-bold text-5xl">
                All Set for the Upcoming Election - Just Hang Tight!
              </h1>
              <p className="font-medium text-2xl mt-5" style={{textWrap: "balance"}}>
                {`Thank you for completing your setup for the upcoming election. You're all ready to go!`}
              </p>
              <p className="font-medium text-2xl mt-2" style={{textWrap: "balance"}}>
                {`While we're counting down to the big day, please sit tight.
                We will notify you the moment the election kicks off. `}
              </p>
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
