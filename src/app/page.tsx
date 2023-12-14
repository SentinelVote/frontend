"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import singpassQrPng from "../../public/singpass_qr.png";
enum LoginType {
  email = "email",
  singpass = "singpass",
}

export default function Home() {
  const [loginType, setLoginType] = useState(LoginType.email);
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
            <div className="flex flex-col gap-4 w-[400px] h-[450px] bg-white rounded-md p-8 self-center justify-between">
              <div className="flex justify-between">
                <h1
                  className={`font-medium text-xl ${
                    loginType === LoginType.email
                      ? "text-black"
                      : "text-gray-400"
                  } cursor-pointer`}
                  onClick={() => setLoginType(LoginType.email)}
                >
                  Login Details
                </h1>
                <h1
                  className={`font-medium text-xl ${
                    loginType === LoginType.singpass
                      ? "text-black"
                      : "text-gray-400"
                  } cursor-pointer`}
                  onClick={() => setLoginType(LoginType.singpass)}
                >
                  Sign in via SingPass
                </h1>
              </div>
              {loginType === LoginType.email ? (
                <>
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
                </>
              ) : (
                <>
                  <div className="flex flex-col justify-center selection:gap-2 text-gray-500">
                    <Image
                      className="self-center"
                      src={singpassQrPng}
                      alt="Singpass Qr"
                      height={225}
                      width={225}
                    />
                    <h1 className="text-black text-xl text-center pt-5 pb-2">
                      SCAN WITH SINGPASS MOBILE APP TO LOG IN
                    </h1>
                    <h1 className="text-center">
                      {`Don't have Singpass mobile? `}
                      <Link
                        href="https://www.singpass.gov.sg/home/ui/register/instructions"
                        target="_blank"
                      >
                        <span className="text-blue-500">Find out more. </span>
                      </Link>
                    </h1>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* <Link href="/singpass-login">Singpass Login</Link>
      <Link href="/candidate-selection">Candidate Selection</Link> */}
    </>
  );
}
