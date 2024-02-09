"use client";
import { GetCookie } from "@/app/globals";
import { useEffect, useState } from "react";
export default function SetPassword() {
  useEffect(() => {
    const email = GetCookie("user_email");
    setEmailCookie(email || "");
  }, []);

  const [emailCookie, setEmailCookie] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPwError, setResetPwError] = useState("");

  const handleForgotEmail = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setResetPwError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/login/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emailCookie, password }),
        }
      );
      const data = await response.json();
      console.log(`Data from forgot-password:\n${data}`);
      if (!response.ok) {
        setResetPwError("Invalid password");
        return;
      }
      window.alert("Password reset successfully!");
      // ClearCookies();
      window.location.href = "/";
    } catch (error) {
      setResetPwError("Error in forgot-password");
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
        <div className="flex max-w-xl text-white justify-center">
          <div className="flex flex-col">
            <div className="flex flex-col align-center">
              <h1 className="font-bold text-5xl">Create New Password</h1>
              <p
                className="font-medium text-slate-200 text-lg mt-2"
                style={{ textWrap: "balance" }}
              >
                Ensure your new password is different from any of your previous
                passwords.
              </p>
            </div>
            <form
              onSubmit={handleForgotEmail}
              className="flex flex-col w-2/3 self-center gap-2 pt-10 text-gray-500"
            >
              <input
                className="border-2 border-slate-900 rounded-lg px-4 py-2"
                type="password"
                name="password"
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                className="border-2 border-slate-900 rounded-lg px-4 py-2"
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Re-enter Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {resetPwError && <p className="text-red-500">{resetPwError}</p>}
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
