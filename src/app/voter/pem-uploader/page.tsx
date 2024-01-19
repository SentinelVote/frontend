"use client";
import { GetCookie } from "@/app/globals";
import Link from "next/link";

const handleFetchPrivateKeyFromDatabase = async () => {
  const cookieEmail = GetCookie("user_email");
  const cookieEmailURIEncoded = encodeURIComponent(cookieEmail || "");
  let response = await fetch(
    `http://localhost:8080/users/${cookieEmailURIEncoded}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  console.log(data);
  alert("Private key fetched from database:\n" + data.privateKey);
  // Store the file content in a cookie
  document.cookie = `privateKey=${encodeURIComponent(data.privateKey)}; path=/`;
};

export default function PemUploaderPage() {
  const handleUpload = () => {
    const fileInput = document.getElementById("pem") as any;
    if (fileInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e: any) {
        const privateKey = e.target.result || "";
        // Store the file content in a cookie
        document.cookie = `privateKey=${encodeURIComponent(
          privateKey
        )}; path=/`;
      };
      reader.readAsText(fileInput.files[0]);
    }
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
        <div className="flex w-full text-white">
          <div className="flex flex-col flex-1 justify-center">
            <div className="flex flex-col">
              <h1 className="font-bold text-5xl">Upload your private key</h1>
              <p className="font-medium text-lg">
                to continue to the SecureVote Platform
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
              <div className="flex gap-2">
                <h1 className="font-medium text-xl text-black text-center">
                  Upload Private Key
                  <span className="font-normal text-base text-slate-700">
                    {" "}
                    (.pem file)
                  </span>
                </h1>
              </div>
              <div className="flex flex-col gap-2 p-10 w-full h-[330px] bg-indigo-100 rounded-md">
                <input
                  className="border-2 border-slate-900 rounded-lg px-4 py-2 text-black"
                  type="file"
                  name="pem"
                  id="pem"
                />
              </div>
              <Link href="/voter/candidate-selection">
                <button
                  type="button"
                  onClick={handleUpload}
                  className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mt-24"
                >
                  UPLOAD FILES
                </button>
              </Link>

              <Link href="/voter/candidate-selection">
                <button
                  type="button"
                  onClick={handleFetchPrivateKeyFromDatabase}
                  className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mt-24"
                >
                  SKIP TO NEXT PAGE (TESTING)
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
