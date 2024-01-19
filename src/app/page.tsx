"use client";
import singpassQrPng from "@public/singpass_qr.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
enum LoginType {
  email = "email",
  singpass = "singpass",
}

export default function Home() {
  const [loginType, setLoginType] = useState(LoginType.email);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      console.log(`Data from login:\n${data}`);

      const {
        success,
        constituency,
        isCentralAuthority,
        hasFoldedPublicKeys: electionHasStarted,
        hasPublicKey: voterHasRegistered,
      } = data;

      console.log(isCentralAuthority);
      if (success) {
        console.log(`Login successful: ${email}`);
        document.cookie = `user_email=${email}`;
        document.cookie = `is_central_authority=${isCentralAuthority}`;
        document.cookie = `success=${success}`;
        document.cookie = `constituency=${constituency}`;
        console.log(document.cookie);
        alert(`Cookies: ${document.cookie}`);

        // admin@sentinelvote.tech : Password1!
        // user1@sentinelvote.tech : Password1!
        // user2@sentinelvote.tech : Password1!
        // user3@sentinelvote.tech : password
        // ...                     : password

        if (!!isCentralAuthority) {
          window.location.href = "/admin";
        } else if (electionHasStarted) {
          if (!!voterHasRegistered) {
            window.location.href = "/voter/pem-uploader";
          } else {
            window.location.href = "/"; // TODO: send voter to a failed to register page.
          }
        } else {
          if (!!voterHasRegistered) {
            window.location.href = "/voter/pending-election";
          } else {
            window.location.href = "/voter/pem-generate";
          }
        }
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login");
    }
  };

  return (
    <>
      <header className="text-white h-[10vh]">
        <div className="flex justify-center md:justify-normal items-center h-full px-10 md:px-24 bg-navbar-bg">
          <Image
            src="/SentinelVote.ico"
            width={36}
            height={36}
            alt="SentinelVote Logo"
          />
          <h2 className="text-2xl p-2 md:pl-2 md:pr-5 font-semibold">
            SentinelVote
          </h2>
          <h2 className="text-lg pl-2 md:pl-5 border-white">Log In</h2>
        </div>
      </header>
      <main
        className="flex flex-col items-center justify-between p-8 lg:p-24 bg-gradient-to-r from-slate-900 to-slate-700 text-slate-900"
        style={{
          minHeight: "90vh",
          overflow: "hidden",
          justifyContent: "center",
        }}
      >
        <div className="flex flex-col md:flex-row w-full text-white">
          <div className="flex flex-col flex-1 justify-center">
            <div className="flex flex-col">
              <h1 className="font-bold text-5xl">Enter your login details</h1>
              <p className="font-medium text-lg">
                to continue to the SentinelVote Platform
              </p>
            </div>
          </div>
          <div className="flex flex-col flex-1 justify-center mt-6 lg:mt-0">
            <div className="flex flex-col gap-4 w-[300px] h-[350px] lg:w-[400px] lg:h-[450px] bg-white rounded-md p-8 self-center justify-between">
              <div className="flex justify-between">
                <h1
                  className={`font-medium text-lg lg:text-xl ${
                    loginType === LoginType.email
                      ? "text-black"
                      : "text-gray-400"
                  } cursor-pointer`}
                  onClick={() => setLoginType(LoginType.email)}
                >
                  Login Details
                </h1>
                <h1
                  className={`font-medium text-lg lg:text-xl ${
                    loginType === LoginType.singpass
                      ? "text-black"
                      : "text-gray-400"
                  } cursor-pointer`}
                  onClick={() => setLoginType(LoginType.singpass)}
                >
                  Login via Singpass
                </h1>
              </div>
              {loginType === LoginType.email ? (
                <>
                  <form
                    onSubmit={handleLogin}
                    className="flex flex-col gap-2 pt-10 text-gray-500"
                  >
                    <input
                      className="border-2 border-slate-900 rounded-lg px-4 py-2"
                      type="text"
                      name="email"
                      id="email"
                      placeholder={"Email"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      className="border-2 border-slate-900 rounded-lg px-4 py-2"
                      type="password"
                      name="password"
                      id="password"
                      placeholder={"Password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="self-end">Forgot password?</p>
                    {loginError && <p className="text-red-500">{loginError}</p>}
                    <button
                      type="submit"
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4
              focus:ring-red-300 font-medium rounded-lg text-sm self-center px-5 py-2.5 w-full
              me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 mt-4 lg:mt-24"
                    >
                      Log In
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="flex flex-col justify-center selection:gap-2 text-gray-500">
                    <Image
                      className="self-center"
                      src={singpassQrPng}
                      alt="Singpass QR Code"
                      height={225}
                      width={225}
                      title={"For demonstration only, do not scan."}
                    />
                    <h1
                      title={"For demonstration only, do not scan."}
                      className="text-black text-xl text-center pt-5 pb-2"
                    >
                      Scan with Singpass app to log in
                    </h1>
                    <p className="text-center">
                      {`Don't have Singpass mobile? `}
                      <Link
                        href="https://www.singpass.gov.sg/home/ui/register/instructions"
                        target="_blank"
                      >
                        <span className="text-blue-500">Find out more.</span>
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
