"use client";
import successPng from "@public/success.png";
import Image from "next/image";
import Link from "next/link";

export default function SuccessPage() {
  const handleExit = () => {
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
              <Image src={successPng} alt="success" height={90} width={90} />
              <h1 className="font-bold text-5xl">
                The election will begin on 23 Dec 2023 at 9am.
              </h1>
              <p className="font-medium text-lg">
                Please check back then to vote. Thank you!
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
                Log out
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
