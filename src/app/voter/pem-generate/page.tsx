"use client";
import { ClearCookies, GetCookie } from "@/app/globals";
import JSZip from "jszip";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PemGeneratePage() {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [userEmailCookie, setUserEmailCookie] = useState("");

  // const roleCookie = getCookie("role");
  useEffect(() => {
    // Now this runs on the client side, so document is defined
    const emailCookie = GetCookie("user_email");
    setUserEmailCookie(emailCookie || "");
    console.log("userEmailCookie", userEmailCookie);
    handleGenerateKey();
  }, []);

  const handleGenerateKey = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/lrs/generate-keys`
      );
      const data = await response.json();
      if (!!data) {
        console.log("PEM generated");
        console.log({ data });
        //TODO: split the data into 2 files, private and public key
        const { privateKey, publicKey } = data;
        setPublicKey(publicKey);
        setPrivateKey(privateKey);
        console.log({ privateKey, publicKey });
      } else {
        console.log("PEM generation failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const storeGeneratedKey = async () => {
    console.log("userEmailCookie:");
    console.log(userEmailCookie);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/voter/keys`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          // Private Keys are only stored for simulation purposes.
          body: JSON.stringify({
            email: userEmailCookie,
            publicKey: publicKey,
            privateKey: privateKey,
          }),
        }
      );
      const data = await response.json();

      if (!!data) {
        console.log(data.message);
      } else {
        console.log("PEM generation failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleZipDownload = async () => {
    try {
      const zip = new JSZip();
      zip.file(
        "publicKey.pem",
        new File([`${publicKey}`], "publicKey.pem", {
          type: "text/plain",
        })
      );
      zip.file(
        "privateKey.pem",
        new File([`${privateKey}`], "privateKey.pem", {
          type: "text/plain",
        })
      );
      const content = await zip.generateAsync({ type: "blob" });

      // Create a blob URL
      const blobUrl = URL.createObjectURL(content);

      // Create a temporary anchor element and trigger download
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = "keys.zip";
      document.body.appendChild(anchor);
      anchor.click();

      // Clean up
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);

      // After download success, store the public key in the database.
      storeGeneratedKey();
    } catch (error) {
      console.error(
        `Error from /pem-generate : Fail to store into the database the new fold-public-keys`,
        error
      );
    }
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
        <div className="flex w-full text-white">
          <div className="flex flex-col flex-1 justify-center">
            <div className="flex flex-col">
              <h1 className="font-bold text-5xl">Generate your PEM</h1>
              <p className="font-medium text-slate-200 text-lg mt-2">
                Generate your private key for the Helios voting platform.
              </p>
              <p className="font-normal text-md text-gray-400">
                Not ready to generate your PEM? Click Exit and log in again
                later.
              </p>
            </div>
          </div>
          <div className="flex flex-col flex-1 justify-center">
            <div
              className="flex flex-col gap-4 w-[540px] h-[220px] bg-white rounded-md px-8 py-10
            self-center"
              style={{
                justifyContent: "space-between",
              }}
            >
              <div className="flex gap-2">
                <h1 className="font-medium text-xl text-black text-center">
                  Download your private key
                  <span className="font-normal text-base text-slate-700">
                    {" "}
                    (.zip file)
                  </span>
                </h1>
              </div>
              <button
                type="button"
                onClick={handleZipDownload}
                className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800
                  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full
                  mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900mt-24"
              >
                DOWNLOAD FILES
              </button>
              <Link href="/" className="self-center">
                <button
                  type="button"
                  onClick={ClearCookies}
                  className="text-gray-900 bg-white border border-gray-300 mt-1 w-[150px]
      focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg
      text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600
      dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                  Log out
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
