"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ClearCookies } from "@/app/globals";

export default function SimulationPage() {
  const [numOfVoters, setNumOfVoters] = useState("1");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (d: any) => {
    alert(JSON.stringify(d));
  };

  const MIN_VOTERS = 1;
  const MAX_VOTERS = 1000000;
  const addComma = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <main
      className="flex flex-col items-center justify-between px-24 py-6 bg-white
        to-slate-700 text-slate-900"
      style={{
        minHeight: "90vh",
        overflow: "hidden",
      }}
    >
      <div className="flex flex-col w-full justify-center text-slate-900 ">
        <div>
          <Link href="/admin">
            <span className="underline text-blue-600">admin</span>
          </Link>
          {" / simulation"}
        </div>
        <h1 className="font-bold text-3xl text-slate-950">Welcome Admin!</h1>
        <p className="font-normal text-md text-slate-500 mt-4">
          This page is designed for the administration of the voting simulation.
          Here, you can control the simulation parameters for a range of 3 to
          1,000,000 users. Adjust the settings below to tailor the simulation to
          your specific requirements.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label style={{ display: "block", marginBottom: "10px" }}>
            Number of Voters: {addComma(parseInt(numOfVoters))}
            <input
              {...register("numOfVoters")}
              type="range"
              min={MIN_VOTERS}
              max={MAX_VOTERS}
              value={numOfVoters}
              onChange={(e) => setNumOfVoters(e.target.value)}
              style={{ width: "100%", margin: "10px 0" }}
            />
          </label>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ marginRight: "20px" }}>
              Production
              <input
                type="radio"
                value="production"
                {...register("optionType", { required: true })}
                style={{ marginLeft: "5px" }}
              ></input>
            </label>
            <label>
              Simulation
              <input
                type="radio"
                value="simulation"
                {...register("optionType", { required: true })}
                style={{ marginLeft: "5px" }}
              ></input>
            </label>
          </div>
          {errors.optionType && (
            <p style={{ color: "red" }}>Please select an option.</p>
          )}
          <button
            type="submit"
            onClick={() => {
              null;
            }}
            className={`focus:outline-none text-white bg-purple-700 hover:bg-purple-800
              focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700
              dark:focus:ring-purple-900 font-medium rounded-lg text-sm px-5 py-2.5 w-52 mt-24`}
          >
            Generate
          </button>
        </form>
        <Link href="/">
          <button
            type="button"
            onClick={ClearCookies}
            className=" bg-white border border-red-300 w-52 focus:outline-none mt-2
            hover:bg-red-100 focus:ring-4 focus:ring-red-200 font-medium rounded-lg text-sm px-5
            py-2.5 me-2 mb-2 dark:bg-red-800 dark:text-white dark:border-red-600dark:hover:bg-red-700
            dark:hover:border-red-600 dark:focus:ring-red-700"
          >
            Log out
          </button>
        </Link>
      </div>
    </main>
  );
}
