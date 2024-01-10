"use client";
import VoteCountBarChart from "@/app/components/VoteCountBarChart";
import VoteCountBarChartPerHour from "@/app/components/VoteCountPerHour";
import VotePieChart from "@/app/components/VotePieChart";
import { Nominee } from "@/types/nominee";
import { Voter } from "@/types/voter";
import * as d3 from "d3";
import * as GeoJSON from "geojson";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import SingaporeAreasGeoJson from "./data/singapore-planning-areas-topojson.json";
import "./styles.scss";
const singaporeAreas = SingaporeAreasGeoJson as GeoJSON.FeatureCollection;
interface Data {
  Hour: string;
  Count: number;
}
// Dummy data for the bar chart
const data: Data[] = [
  { Hour: "1am", Count: 10 },
  { Hour: "3am", Count: 20 },
  { Hour: "5am", Count: 5 },
  { Hour: "7am", Count: 30 },
  { Hour: "9am", Count: 25 },
  { Hour: "11am", Count: 40 },
  { Hour: "1pm", Count: 15 },
  { Hour: "3pm", Count: 35 },
  { Hour: "5pm", Count: 45 },
  { Hour: "7pm", Count: 10 },
  { Hour: "9pm", Count: 50 },
  { Hour: "11pm", Count: 5 },
  { Hour: "12am", Count: 10 },
];

const nominees: Nominee[] = [
  {
    id: 1,
    name: "Tharman Shanmugaratnam",
    party: "Independent",
    voteCount: 600000,
    color: "#2563EB",
  },
  {
    id: 2,
    name: "Tan Kin Lian",
    party: "Independent",
    voteCount: 220000,
    color: "#FB923C",
  },
  {
    id: 3,
    name: "Ng Kok Song",
    party: "Independent",
    voteCount: 180000,
    color: "#C084FC",
  },
];

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
  const totalVotes = nominees.reduce((acc, nominee) => {
    return acc + nominee.voteCount;
  }, 0);
  console.log(totalVotes);

  return (
    <main
      className="flex flex-col items-center justify-between px-6 py-6 bg-white
        to-slate-700 text-slate-900 h-80vh"
      style={{
        overflow: "hidden",
        justifyContent: "center",
      }}
    >
      <div className="flex w-full text-white align-middle justify-center">
        <div className="flex flex-col border border-gray-300 rounded-lg p-4 mr-2">
          <div className="flex flex-col gap-2">
            <h1 className="font-medium text-5x text-slate-900">
              Vote Count Per Hour
            </h1>
            <VoteCountBarChartPerHour data={data} />
            <h1 className="font-medium text-5x text-slate-900">Map View</h1>
            <SingaporeMap />

            {/* <Link href="/">
              <button
                type="button"
                className=" bg-white border border-gray-300 w-full self-center
      focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg
      text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600
      dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Log out
              </button>
            </Link> */}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="border border-gray-300 rounded-lg p-4">
            <h1 className="font-medium text-5x text-slate-900 mb-2">
              Current Vote Leader
            </h1>
            <div
              style={{
                width: "580px",
                minHeight: "270px",
                borderRadius: "10px",
              }}
            >
              <div className="flex justify-between p-2 font-normal text-gray-500">
                <span className="text-sm ">No.</span>
                <span className="text-sm">Nominee</span>
                <span className="text-sm ml-16">Party</span>
                <span className="text-sm">Total Count</span>
              </div>
              {nominees.map((nominee) => (
                <div
                  key={nominee.id}
                  className="flex items-center justify-between my-2 p-2 border rounded-md text-slate-900 shadow-md"
                >
                  <span className="text-md text-gray-500 ml-2">
                    {nominee.id}
                  </span>

                  <div className="flex items-center w-[180px] font-normal">
                    <div
                      className="flex-shrink-0 h-12 w-12 overflow-hidden rounded-full border border-black mr-4 "
                      style={{
                        opacity: "0.9",
                        backgroundColor: nominee.color,
                      }}
                    >
                      <Image
                        src="/user.svg"
                        alt="profile"
                        width="10"
                        height="10"
                        className="h-full w-full"
                      />
                    </div>
                    <div>
                      <span className="text-sm">{nominee.name}</span>
                    </div>
                  </div>
                  <span className="text-sm">{nominee.party}</span>
                  <span className="text-sm">
                    {nominee.voteCount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-[10px]">
            <div className="border border-gray-300 rounded-lg p-4">
              <h1 className="font-medium text-base text-slate-900 ">
                Vote Percentage
              </h1>
              <div
                style={{
                  width: "270px",
                  height: "270px",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <VotePieChart nominees={nominees} />
                <div className="flex flex-col gap-2">
                  {nominees.map((nominee, index) => {
                    return (
                      <div
                        className="flex justify-between text-slate-900"
                        key={index}
                      >
                        <div className="flex">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: nominee.color }}
                          ></div>
                          <span className="text-xs">{nominee.name}</span>
                        </div>
                        <span className="text-xs ml-2">
                          {(nominee.voteCount / totalVotes) * 100}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="border border-gray-300 rounded-lg p-4">
              <h1 className="font-medium text-5x text-slate-900 ">
                Vote Count
              </h1>
              <div
                style={{
                  width: "270px",
                  height: "270px",
                  borderRadius: "10px",
                }}
              >
                <h1 className="font-normal text-2xl text-slate-900 ">
                  {totalVotes.toLocaleString()}
                </h1>
                <VoteCountBarChart nominees={nominees} />
                <div className="flex flex-col gap-2">
                  {nominees.map((nominee, index) => {
                    return (
                      <div
                        className="flex justify-between text-slate-900"
                        key={index}
                      >
                        <div className="flex">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: nominee.color }}
                          ></div>
                          <span className="text-xs">{nominee.name}</span>
                        </div>
                        <span className="text-xs ml-2">
                          {(nominee.voteCount / totalVotes) * 100}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
interface CountsByAreaByHr {
  [key: string]: number;
}

const countsByAreaByHr: CountsByAreaByHr = {
  OUTRAM: 1000,
  "BUKIT MERAH": 500,
  "DOWNTOWN CORE": 200,
  "MARINA SOUTH": 100,
  "SINGAPORE RIVER": 1500,
  QUEENSTOWN: 100,
  "MARINA EAST": 200,
  "RIVER VALLEY": 300,
  "WESTERN ISLANDS": 0,
  "SOUTHERN ISLANDS": 0,
  "STRAITS VIEW": 600,
  "MARINE PARADE": 700,
  ROCHOR: 800,
  KALLANG: 900,
  ORCHARD: 1000,
  NEWTON: 1100,
  PIONEER: 1200,
  TANGLIN: 1300,
  CLEMENTI: 1400,
  TUAS: 100,
  BEDOK: 200,
  MUSEUM: 300,
  "JURONG EAST": 400,
  GEYLANG: 500,
  "BOON LAY": 600,
  "BUKIT TIMAH": 700,
  NOVENA: 800,
  TAMPINES: 900,
  "BUKIT BATOK": 1000,
  "JURONG WEST": 1100,
  SERANGOON: 1200,
  HOUGANG: 1300,
  "PAYA LEBAR": 1400,
  BISHAN: 100,
  "TOA PAYOH": 200,
  "BUKIT PANJANG": 300,
  "CHANGI BAY": 400,
  "ANG MO KIO": 500,
  "PASIR RIS": 600,
  TENGAH: 50,
  "CHOA CHU KANG": 100,
  SENGKANG: 2000,
  CHANGI: 300,
  PUNNGOL: 400,
  "SUNGEI KADUT": 500,
  YISHUN: 600,
  MANDAI: 700,
  SELETAR: 800,
  WOODLANDS: 900,
  "WESTERN WATER CATCHMENT": 10,
  "NORTH-EASTERN ISLANDS": 0,
  SIMPANG: 30,
  SEMBAWANG: 40,
  "CENTRAL WATER CATCHMENT": 0,
  "LIM CHU KANG": 50,
};
const maxCount = Math.max(...Object.values(countsByAreaByHr));
const colorScale = d3.scaleSequential([0, maxCount], d3.interpolateBlues);

const maxVotesPerArea = Math.max(...Object.values(countsByAreaByHr));
const maxVotesPerAreaName = Object.keys(countsByAreaByHr).find(
  (key) => countsByAreaByHr[key] === maxVotesPerArea
);
const SingaporeMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const addComma = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  useEffect(() => {
    d3.select("#map").selectAll("*").remove();
    const width = 500;
    const height = 300;
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
    if (mapContainerRef.current) {
      const projection = d3
        .geoMercator()
        .fitSize([width, height], singaporeAreas as any);
      const pathGenerator = d3.geoPath().projection(projection);

      const svg = d3
        .select(mapContainerRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      svg
        .selectAll(".area")
        .data(SingaporeAreasGeoJson.features)
        .enter()
        .append("path")
        .attr("class", "area")
        .attr("d", pathGenerator as any)
        .attr("fill", (d) => {
          const count = countsByAreaByHr[d.properties.PLN_AREA_N] || 0;
          return colorScale(count);
        })
        .style("stroke", "#000")
        .style("stroke-width", 0.5)
        .on("mouseover", (event, d) => {
          const areaName = d.properties.PLN_AREA_N;
          const countValue = countsByAreaByHr[areaName] || 0;

          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(`${areaName}:<br/>${addComma(countValue)} votes`)
            .style("left", event.pageX + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px");
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        });
    }
  }, []);

  return (
    <div className="flex flex-col relative justify-center w-full">
      <div ref={mapContainerRef} id="map" className="self-center" />
      <div className="absolute bottom-0 right-0 text-xs text-slate-900">
        <h1>Highest: {addComma(maxVotesPerArea)} votes</h1>
        <h1 className="capitalize">Location: {maxVotesPerAreaName}</h1>
      </div>
    </div>
  );
};
