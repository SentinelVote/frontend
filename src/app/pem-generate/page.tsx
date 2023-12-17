"use client";
import JSZip from "jszip";
import { useEffect, useState } from "react";
export default function PemUploader() {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  function getCookie(name: string) {
    if (document === undefined) return null;
    else {
      const cookieArray = document?.cookie.split("; ");
      const cookie = cookieArray.find((row) => row.startsWith(name + "="));
      return cookie ? cookie.split("=")[1] : null;
    }
  }
  // const roleCookie = getCookie("role");
  const userEmailCookie = getCookie("user_email");
  console.log("userEmailCookie", userEmailCookie);
  const handleGenerateKey = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/generate-keys");
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

  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/users");
      const data = await response.json();
      console.log({ data });
    } catch (error) {
      console.error(error);
    }
  };

  const storeGeneratedPubKey = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/store-pubkey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmailCookie, publicKey }),
      });
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

  useEffect(() => {
    getUsers();
    handleGenerateKey();
  }, []);

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
      // Append to the document
      document.body.appendChild(anchor);
      // Trigger the download
      anchor.click();
      // Clean up
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
      // After download success, store the public key in the database
      storeGeneratedPubKey();
      //TODO: call fold public keys from LRS API and update the database
    } catch (error) {
      console.error("Error generating zip file:", error);
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
              <h1 className="font-bold text-5xl">Generate your PEM</h1>
              <p className="font-medium text-lg">
                to generate your private key for the Helios voting platform
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
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
