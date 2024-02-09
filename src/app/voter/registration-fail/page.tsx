"use client";
import { ClearCookies } from "@/app/globals";
import Link from "next/link";

export default function RegistrationFail() {
  const handleExit = () => {
    ClearCookies();
    window.close();
  };
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
            <div className="flex flex-col align-center">
              <h1 className="font-bold text-5xl"> Registration Failed</h1>
              <p className="font-medium text-lg">
                You did not register for election before the deadline, you
                cannot participate. Stay tuned for election updates!
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
    </>
  );
}
