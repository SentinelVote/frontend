import Link from "next/link";
export default function Home() {
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
              <h1 className="font-bold text-5xl">Enter your login details</h1>
              <p className="font-medium text-lg">
                to continue to the Helios voting platform
              </p>
            </div>
          </div>
          <div className="flex flex-col flex-1 justify-center">
            <div className="flex flex-col gap-4 w-[350px] h-[450px] bg-white rounded-md px-8 py-10 self-center">
              <h1 className="font-medium text-xl text-black">Login Details</h1>
              <div className="flex flex-col gap-2 pt-10 text-gray-500">
                <input
                  className="border-2 border-slate-900 rounded-lg px-4 py-2"
                  type="text"
                  name="email"
                  id="email"
                />
                <input
                  className="border-2 border-slate-900 rounded-lg px-4 py-2"
                  type="password"
                  name="password"
                  id="password"
                />
                <p className="self-end">Forgot password?</p>
              </div>
              <Link href="/pem-uploader">
                <button
                  type="button"
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4
                 focus:ring-red-300 font-medium rounded-lg text-sm self-center px-5 py-2.5 w-full
                 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 mt-24"
                >
                  Log In
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
