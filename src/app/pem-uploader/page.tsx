import Link from "next/link";

export default function PemUploader() {
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
        <div className="flex w-full text-white">
          <div className="flex flex-col flex-1 justify-center">
            <div className="flex flex-col">
              <h1 className="font-bold text-5xl">Upload your PEM</h1>
              <p className="font-medium text-lg">
                to continue to the Helios voting platform
              </p>
            </div>
          </div>
          <div className="flex flex-col flex-1 justify-center">
            <div
              className="flex flex-col gap-4 w-[540px] h-[450px] bg-white rounded-md px-8 py-10
            self-center"
              style={{
                justifyContent: "space-between",
              }}
            >
              <h1 className="font-medium text-xl text-black text-center">
                Upload PEM
              </h1>
              <div className="flex flex-col gap-2 p-10 w-full h-[330px] bg-indigo-100 rounded-md">
                <input
                  className="border-2 border-slate-900 rounded-lg px-4 py-2 text-black"
                  type="file"
                  name="pem"
                  id="pem"
                />
              </div>
              <Link href="/candidate-selection">
                <button
                  type="button"
                  className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800
                  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full
                  mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900mt-24"
                >
                  UPLOAD FILES
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      {/* <Link href="/singpass-login">Singpass Login</Link>
      <Link href="/candidate-selection">Candidate Selection</Link> */}
    </>
  );
}
