"use client";
import Image from "next/image";
import Link from "next/link";
import successPng from "../../../../public/success.png";
export default function SuccessPage() {
  const handleExit = () => {
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
        <div className="flex  w-full text-white justify-center">
          <div className="flex flex-col">
            <div className="flex flex-col align-center">
              <Image src={successPng} alt="success" height={90} width={90} />
              <h1 className="font-bold text-5xl">Thank you for voting!</h1>
              <p className="font-medium text-lg">
                Your vote has been successfully submitted.
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
