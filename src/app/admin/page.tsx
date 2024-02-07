"use client";
import { ClearCookies } from "@/app/globals";
import { Voter } from "@/types/voter";
import registeredVoter from "@public/registered_voter.svg";
import voted from "@public/voted.svg";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;
const MAX_PAGES_DISPLAYED = 5;

const handleExit = () => {
  ClearCookies();
  window.close();
};

/** @returns {Promise<boolean>} true if the blockchain has folded public keys, false otherwise */
const blockchainHasFoldedPublicKeys = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/fabric/folded-public-keys`
    );
    if (!response.ok) {
      return false;
    } else if ((await response.text()) === "Missing/Unset") {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};
const hasVoteStarted = blockchainHasFoldedPublicKeys();

const checkVoteEnd = async () => {
  return true;
};

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
        ? "text-neutral-400 border-slate-900 max-h-12"
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
  const [deactivatePublishButton, setDeactivatePublishButton] = useState(false);
  const [voteEnded, setVoteEnded] = useState<Boolean>(false);

  useEffect(() => {
    const checkAndSetVoteStart = async () => {
      const voteStart = await blockchainHasFoldedPublicKeys();
      setDeactivateFoldButton(voteStart);
    };
    checkAndSetVoteStart();
  }, []);

  //TODO: Add function to checkVoteEnd
  useEffect(() => {
    const checkAndSetVoteEnd = async () => {
      const voteEnd = await checkVoteEnd();
      setVoteEnded(voteEnd);
    };
    checkAndSetVoteEnd();
  }, []);

  // Calculate the voters to show on the current page
  const indexOfLastVoter = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstVoter = indexOfLastVoter - ITEMS_PER_PAGE;
  const currentVoters = voters.slice(indexOfFirstVoter, indexOfLastVoter);

  // const halfRange = Math.floor(MAX_PAGES_DISPLAYED / 2);

  // Change page
  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);
  // Calculate page numbers
  const totalPages = Math.ceil(voters.length / ITEMS_PER_PAGE);
  const halfRange = Math.floor(MAX_PAGES_DISPLAYED / 2);
  let start = Math.max(1, currentPage - halfRange);
  let end = Math.min(totalPages, currentPage + halfRange);

  const getPaginationRange = () => {
    const totalPageNumbers = Math.ceil(voters.length / ITEMS_PER_PAGE);
    const start = Math.max(1, currentPage - halfRange);
    const end = Math.min(totalPageNumbers, currentPage + halfRange);

    let range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add ellipsis and first page at the beginning if necessary
    if (start > 2) {
      range.unshift("...");
      range.unshift(1);
    } else if (start === 2) {
      range.unshift(1);
    }

    // Add ellipsis and last page at the end if necessary
    if (end < totalPageNumbers - 1) {
      range.push("...");
      range.push(totalPageNumbers);
    } else if (end === totalPageNumbers - 1) {
      range.push(totalPageNumbers);
    }

    return range;
  };

  const pageNumbers = getPaginationRange();

  const foldKeys = async () => {
    console.log("button was called.");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/keys/public/folded`,
        {
          method: "PUT",
        }
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
  //Initial PublishResults logic
  const publishResults = async () => {
    console.log("publish results click was called");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/announce`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      window.alert("Results have been published");
      console.log({ data });
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublishClick = () => {
    publishResults();
    setDeactivatePublishButton(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users`
        );
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
        <div className="flex flex-col w-[350px] h-auto">
          <div className="flex flex-col gap-2 mr-6 h-full justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-3xl text-slate-950">
                Welcome Admin!
              </h1>
              <div className="flex gap-[1px]">
                <Link href="/admin/simulation" className="flex-1">
                  <button
                    type="button"
                    className=" bg-white border border-stone-600 w-full self-center
                    focus:outline-none hover:bg-gray-100 focus:ring-1 focus:ring-gray-200 font-medium rounded-l-lg
                    text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600
                    dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    Simulation Page
                  </button>
                </Link>
                <Link href="/admin/helios" className="flex-1">
                  <button
                    type="button"
                    disabled={!deactivateFoldButton}
                    className={`bg-white border border-stone-600 w-full self-center font-medium rounded-r-lg
                  text-sm px-5 py-2.5 me-2 ${
                    deactivateFoldButton
                      ? `focus:outline-none focus:ring-1 hover:bg-gray-100  focus:ring-gray-200  dark:bg-gray-800 dark:text-white
                  dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700`
                      : `focus:outline-none dark:bg-gray-800 dark:text-white
                  dark:border-gray-600 brightness-75 cursor-not-allowed`
                  }`}
                  >
                    Helios Page
                  </button>
                </Link>
              </div>
              <div className="flex flex-col bg-white min-w-full rounded-md shadow-2xl border-[0.1px] border-slate-400">
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
                      {voters.length.toLocaleString()}
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
                      {voters
                        .filter((voter) => voter.publicKey !== "")
                        .length.toLocaleString()}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            {/*TODO: Refine function */}
            {voteEnded ? (
              <div className="flex flex-col gap-2">
                <p className="font-normal text-md text-red-400 mt-2 pb-16">
                  {`The election has ended. You can no longer fold the keys. Please proceed to the Helios Platform to view the results.`}
                </p>
                <button
                  type="button"
                  id={"fold-keys"}
                  disabled={deactivatePublishButton}
                  onClick={handlePublishClick}
                  className={`focus:outline-none text-white ${
                    deactivatePublishButton
                      ? "bg-neutral-200 shadow-inner cursor-not-allowed"
                      : "bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-300 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-900"
                  }
                  font-medium rounded-lg text-sm px-5 py-2.5 w-full`}
                >
                  Publish Results
                </button>
                <Link href="/">
                  <button
                    type="button"
                    onClick={handleExit}
                    className=" bg-white border border-red-300 w-full self-center
      focus:outline-none hover:bg-red-100 focus:ring-4 focus:ring-red-200 font-medium rounded-lg
      text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-800 dark:text-white dark:border-red-600
      dark:hover:bg-red-700 dark:hover:border-red-600 dark:focus:ring-red-700"
                  >
                    Log out
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="font-normal text-md text-slate-500 mt-2">
                  {`Click on 'Fold Keys' to initiate the folding of public keys, signaling the commencement of the election.
              `}
                </p>
                <p className="font-normal text-md text-red-400 mt-2">
                  {`Be aware that once the election begins, the option to fold the keys will no longer be available.`}
                </p>
                <button
                  type="button"
                  id={"fold-keys"}
                  disabled={deactivateFoldButton}
                  onClick={handleFoldKeys}
                  className={`focus:outline-none text-white ${
                    deactivateFoldButton
                      ? "bg-neutral-200 shadow-inner cursor-not-allowed"
                      : "bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                  }
                  font-medium rounded-lg text-sm px-5 py-2.5 w-full`}
                >
                  Fold Keys
                </button>
                <Link href="/">
                  <button
                    type="button"
                    onClick={handleExit}
                    className=" bg-white border border-red-300 w-full self-center
      focus:outline-none hover:bg-red-100 focus:ring-4 focus:ring-red-200 font-medium rounded-lg
      text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-800 dark:text-white dark:border-red-600
      dark:hover:bg-red-700 dark:hover:border-red-600 dark:focus:ring-red-700"
                  >
                    Log out
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 justify-center">
          <div className="flex flex-col justify-between bg-white shadow-2xl border-[0.1px] border-slate-400 text-slate-900 min-h-[650px] min-w-[600px] rounded-lg">
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
                      <TableCell isHeader>Constituency</TableCell>
                      <TableCell isHeader>Has Public Key?</TableCell>
                    </TableRow>
                  </thead>
                  <tbody>
                    {currentVoters.map((voter) => (
                      <TableRow key={voter.email}>
                        <TableCell>{voter.firstName}</TableCell>
                        <TableCell>{voter.lastName}</TableCell>
                        <TableCell>{voter.email}</TableCell>
                        <TableCell>{voter.constituency}</TableCell>
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
                {/*TODO: Accomodate for 6 digit*/}
                <h1 className="justify-center text-slate-500">
                  {`Showing data 1 to ${currentVoters.length} of
                    ${voters.length.toLocaleString()} entries`}
                </h1>
                <nav>
                  <ul className="flex list-none">
                    {pageNumbers.map((number, index) => (
                      <li
                        key={index}
                        className={`border px-3 py-1 cursor-pointer ${
                          number === currentPage ? "bg-gray-200" : ""
                        }`}
                        onClick={() => number !== "..." && paginate(number)}
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
