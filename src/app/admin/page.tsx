"use client";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import registeredVoter from "../../../public/registered_voter.svg";
import voted from "../../../public/voted.svg";
import { Voter } from "../../types/voter";

const ITEMS_PER_PAGE = 12;

const checkVoteStart = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/check-vote-start");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const hasVoteStarted = checkVoteStart();

const TableContainer: React.FC<TableProps> = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full min-h-full bg-white">{children}</table>
  </div>
);

interface TableProps {
  children: ReactNode;
}

interface TableRowProps {
  children: ReactNode;
  isHeader?: boolean;
}
interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
}
const TableRow: React.FC<TableRowProps> = ({ children, isHeader = false }) => (
  <tr
    className={`border-b-[0.2px]  ${
      isHeader
        ? "text-neutral-400 border-slate-900"
        : "bg-white hover:bg-slate-100"
    }`}
  >
    {children}
  </tr>
);

const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
}) => {
  const baseStyle = "px-4 py-2";
  return (
    <td className={`${baseStyle} ${isHeader ? "text-left font-medium" : ""}`}>
      {children}
    </td>
  );
};

export default function AdminPage() {
  console.log(hasVoteStarted);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deactivateFoldButton, setDeactivateFoldButton] = useState(false);

  useEffect(() => {
    const checkAndSetVoteStart = async () => {
      const voteStart = await checkVoteStart();
      setDeactivateFoldButton(voteStart);
    };

    checkAndSetVoteStart();
  }, []);

  // Calculate the voters to show on the current page
  const indexOfLastVoter = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstVoter = indexOfLastVoter - ITEMS_PER_PAGE;
  const currentVoters = voters.slice(indexOfFirstVoter, indexOfLastVoter);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  // Calculate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(voters.length / ITEMS_PER_PAGE); i++) {
    pageNumbers.push(i);
  }

  const foldKeys = async () => {
    console.log("button was called.");
    try {
      const response = await fetch(
        "http://localhost:3001/api/fold-public-keys"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log({ data });
    } catch (error) {
      console.error("Fetch error:", error);
    }
    console.log("end of function.");
  };

  const handleFoldKeys = () => {
    foldKeys();
    setDeactivateFoldButton(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Voter[] = await response.json();
        setVoters(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchUsers();
  }, []);
  return (
    <main
      className="flex flex-col items-center justify-between px-24 py-6 bg-white
        to-slate-700 text-slate-900"
      style={{
        minHeight: "90vh",
        overflow: "hidden",
        justifyContent: "center",
      }}
    >
      <div className="flex w-full text-white">
        <div className="flex flex-col w-[350px]">
          <div className="flex flex-col gap-2 mr-6">
            <h1 className="font-bold text-3xl text-slate-950">
              Welcome Admin!
            </h1>
            <div className="flex flex-col bg-white min-w-full rounded-md shadow-2xl">
              <div className="flex p-4 gap-6 border-b-[0.5px] border-slate-400">
                <div className=" flex content-center justify-center w-12 h-12 bg-green-200 rounded-full self-center">
                  <Image
                    src={registeredVoter}
                    height={24}
                    width={24}
                    alt="registered voter"
                  ></Image>
                </div>

                <div className="flex flex-col">
                  <p className="text-slate-400">Total Eligible Voters</p>
                  <h1 className="text-3xl font-extrabold text-slate-950">
                    {voters.length}
                  </h1>
                </div>
              </div>
              <div className="flex p-4 gap-6">
                <div className=" flex content-center justify-center w-12 h-12 bg-green-200 rounded-full self-center">
                  <Image
                    src={voted}
                    height={24}
                    width={24}
                    alt="registered voter"
                  ></Image>
                </div>

                <div className="flex flex-col">
                  <p className="text-slate-400">Total Registered Voters</p>
                  <h1 className="text-3xl font-extrabold text-slate-950">
                    {voters.filter((voter) => voter.publicKey !== "").length}
                  </h1>
                </div>
              </div>
            </div>

            <p className="font-normal text-md text-slate-500 mt-4">
              {`Click on 'Fold Keys' to initiate the folding of public keys, signaling the commencement of the election.
              `}
            </p>
            <p className="font-normal text-md text-red-400 mt-2">
              {`Be aware that once the election begins, the option to fold the keys will no longer be available.`}
            </p>
            <button
              type="button"
              disabled={deactivateFoldButton}
              onClick={handleFoldKeys}
              className={`focus:outline-none text-white ${
                deactivateFoldButton
                  ? "bg-neutral-200 shadow-inner cursor-not-allowed"
                  : "bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
              }
                  font-medium rounded-lg text-sm px-5 py-2.5 w-full
                    mt-24`}
            >
              Fold Keys
            </button>
            <Link href="/admin/helios">
              <button
                type="button"
                className=" bg-white border border-gray-300 w-full self-center
      focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg
      text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600
      dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Go to Helios Platform
              </button>
            </Link>
            <Link href="/">
              <button
                type="button"
                className=" bg-white border border-gray-300 w-full self-center
      focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg
      text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600
      dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Log out
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col flex-1 justify-center">
          <div className="flex flex-col justify-between bg-white shadow-2xl text-slate-900 min-h-[600px] min-w-[600px] rounded-lg">
            <div
              className="container mx-auto p-4 justify-between min-h-full"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div>
                <div className="flex justify-between">
                  <h1 className="text-2xl font-bold mb-4">All Voters</h1>
                  <div className="mb-4">
                    <input
                      className="p-2 border rounded"
                      placeholder="Search"
                    />
                    {/* ... additional controls ... */}
                  </div>
                </div>

                <TableContainer>
                  <thead>
                    <TableRow isHeader>
                      <TableCell isHeader>First Name</TableCell>
                      <TableCell isHeader>Last Name</TableCell>
                      <TableCell isHeader>Email</TableCell>
                      <TableCell isHeader>City</TableCell>
                      <TableCell isHeader>HasPubKey</TableCell>
                    </TableRow>
                  </thead>
                  <tbody>
                    {currentVoters.map((voter) => (
                      <TableRow key={voter.userEmail}>
                        <TableCell>{voter.firstName}</TableCell>
                        <TableCell>{voter.lastName}</TableCell>
                        <TableCell>{voter.userEmail}</TableCell>
                        <TableCell>{voter.region}</TableCell>

                        <TableCell>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              voter.publicKey !== ""
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {voter.publicKey !== "" ? "Yes" : "No"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </TableContainer>
              </div>
              <div className="flex mt-2 justify-between">
                <h1 className="justify-center text-slate-500">
                  {`Showing data 1 to ${currentVoters.length} of
                    ${voters.length} entries`}
                </h1>
                <nav>
                  <ul className="flex list-none">
                    {pageNumbers.map((number) => (
                      <li
                        key={number}
                        className="border px-3 py-1 cursor-pointer"
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
