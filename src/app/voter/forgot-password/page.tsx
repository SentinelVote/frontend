"use client";
import { useState } from "react";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const handleForgotEmail = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      console.log(`Data from forgot-password:\n${data}`);
      if (!response.ok) {
        setEmailError("Invalid email");
        return;
      }
    } catch (error) {
      null;
      //   setEmailError("Error in forgot-password");
    }
    window.alert("Email sent to reset password!");
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
        <div className="flex max-w-xl text-white justify-center">
          <div className="flex flex-col">
            <div className="flex flex-col align-center">
              <h1 className="font-bold text-5xl">Forgot Password Page</h1>
              <p
                className="font-medium text-slate-200 text-lg mt-2"
                style={{ textWrap: "balance" }}
              >
                {`Enter the email address associated with your account and we'll send you a link to reset your password.`}
              </p>
            </div>
            <form
              onSubmit={handleForgotEmail}
              className="flex flex-col w-2/3 self-center gap-2 pt-10 text-gray-500"
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
              {emailError && <p className="text-slate-500">{emailError}</p>}
              <button
                type="submit"
                className="focus:outline-none text-white bg-slate-700 hover:bg-slate-800 focus:ring-4
              focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full self-baseline
              me-2 mb-2 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-900 mt-1 "
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
