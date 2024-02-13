"use client";
import VoteCountBarChart from "@/app/components/VoteCountBarChart";
import VoteCountBarChartPerHour from "@/app/components/VoteCountPerHour";
import VotePieChart from "@/app/components/VotePieChart";
import { Nominee } from "@/types/nominee";
import * as d3 from "d3";
import * as GeoJSON from "geojson";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SingaporeAreasGeoJson from "./data/singapore-planning-areas-topojson.json";
import "./styles.scss";
const singaporeAreas = SingaporeAreasGeoJson as GeoJSON.FeatureCollection;

const ITEMS_PER_PAGE = 12;
interface CountsByAreaByHr {
  [key: string]: number;
}

type votingDetailsType = {
  countCandidate: any;
  countConstituency: any;
  countHour: Number[];
  countTotal: Number;
};

export default function Page() {
  const initialVotingDetails: votingDetailsType = {
    countCandidate: 0,
    countConstituency: {},
    countHour: [],
    countTotal: 0,
  };

  const [votingDetails, setVotingDetails] =
    useState<votingDetailsType>(initialVotingDetails);

  const getVotingDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/fabric/vote`
      );
      const data = await response.json();
      setVotingDetails(data);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getVotingDetails();
  }, []);

  // const { countCandidate, countConstituency, countHour, countTotal } =
  //   votingDetails;

  console.log("Test:");
  console.log(votingDetails?.countCandidate);

  console.log("Tan Kin Lian: ", votingDetails?.countCandidate["Tan Kin Lian"]);
  console.log(
    "Tharman Shanmugaratnam: ",
    votingDetails?.countCandidate["Tharman Shanmugaratnam"]
  );
  console.log("Ng Kok Song: ", votingDetails?.countCandidate["Ng Kok Song"]);

  console.log("TOA PAYOH: ", votingDetails?.countConstituency["TOA PAYOH"]);
  console.log(votingDetails?.countHour);
  console.log(votingDetails?.countTotal);

  const nominees: Nominee[] = [
    {
      name: "Tharman Shanmugaratnam",
      party: "Independent",
      voteCount: votingDetails?.countCandidate["Tharman Shanmugaratnam"] || 0,
      color: "#2563EB",
    },
    {
      name: "Tan Kin Lian",
      party: "Independent",
      voteCount: votingDetails?.countCandidate["Tan Kin Lian"] || 0,
      color: "#FB923C",
    },
    {
      name: "Ng Kok Song",
      party: "Independent",
      voteCount: votingDetails?.countCandidate["Ng Kok Song"] || 0,
      color: "#C084FC",
    },
  ];
  const sortedNominees = [...nominees].sort(
    (a, b) => b.voteCount - a.voteCount
  );
  const totalVotes = nominees.reduce((acc, nominee) => {
    return acc + nominee.voteCount;
  }, 0);
  interface Data {
    Hour: string;
    Count: Number;
  }

  // Dummy data for the bar chart
  const data: Data[] = [
    // { Hour: "1am", Count: votingDetails?.countHour[1] },
    // { Hour: "2am", Count: votingDetails?.countHour[2] },
    // { Hour: "3am", Count: votingDetails?.countHour[3] },
    // { Hour: "4am", Count: votingDetails?.countHour[4] },
    // { Hour: "5am", Count: votingDetails?.countHour[5] },
    // { Hour: "6am", Count: votingDetails?.countHour[6] },
    // { Hour: "7am", Count: votingDetails?.countHour[7] },
    { Hour: "8am", Count: votingDetails?.countHour[8] },
    { Hour: "9am", Count: votingDetails?.countHour[9] },
    { Hour: "10am", Count: votingDetails?.countHour[10] },
    { Hour: "11am", Count: votingDetails?.countHour[11] },
    { Hour: "12pm", Count: votingDetails?.countHour[12] },
    { Hour: "1pm", Count: votingDetails?.countHour[13] },
    { Hour: "2pm", Count: votingDetails?.countHour[14] },
    // { Hour: "3pm", Count: votingDetails?.countHour[15] },
    // { Hour: "4pm", Count: votingDetails?.countHour[16] },
    // { Hour: "5pm", Count: votingDetails?.countHour[17] },
    // { Hour: "6pm", Count: votingDetails?.countHour[18] },
    { Hour: "3pm", Count: votingDetails?.countHour[20] },
    { Hour: "4pm", Count: votingDetails?.countHour[21] },
    { Hour: "5pm", Count: votingDetails?.countHour[22] },
    { Hour: "6pm", Count: votingDetails?.countHour[23] },
    // { Hour: "7pm", Count: votingDetails?.countHour[19] },
    // { Hour: "8pm", Count: votingDetails?.countHour[20] },
    // { Hour: "9pm", Count: votingDetails?.countHour[21] },
    // { Hour: "10pm", Count: votingDetails?.countHour[22] },
    // { Hour: "11pm", Count: votingDetails?.countHour[23] },
    // { Hour: "12am", Count: votingDetails?.countHour[0] },
  ];

  const countsByAreaByHr: CountsByAreaByHr = {
    OUTRAM: votingDetails?.countConstituency["OUTRAM"] || 0,
    "BUKIT MERAH": votingDetails?.countConstituency["BUKIT MERAH"] || 0,
    "DOWNTOWN CORE": votingDetails?.countConstituency["DOWNTOWN CORE"] || 0,
    "MARINA SOUTH": votingDetails?.countConstituency["MARINA SOUTH"] || 0,
    "SINGAPORE RIVER": votingDetails?.countConstituency["SINGAPORE RIVER"] || 0,
    QUEENSTOWN: votingDetails?.countConstituency["QUEENSTOWN"] || 0,
    "MARINA EAST": votingDetails?.countConstituency["MARINA EAST"] || 0,
    "RIVER VALLEY": votingDetails?.countConstituency["RIVER VALLEY"] || 0,
    "WESTERN ISLANDS": votingDetails?.countConstituency["WESTERN ISLANDS"] || 0,
    "SOUTHERN ISLANDS":
      votingDetails?.countConstituency["SOUTHERN ISLANDS"] || 0,
    "STRAITS VIEW": votingDetails?.countConstituency["STRAITS VIEW"] || 0,
    "MARINE PARADE": votingDetails?.countConstituency["MARINE PARADE"] || 0,
    ROCHOR: votingDetails?.countConstituency["ROCHOR"] || 0,
    KALLANG: votingDetails?.countConstituency["KALLANG"] || 0,
    ORCHARD: votingDetails?.countConstituency["ORCHARD"] || 0,
    NEWTON: votingDetails?.countConstituency["NEWTON"] || 0,
    PIONEER: votingDetails?.countConstituency["PIONEER"] || 0,
    TANGLIN: votingDetails?.countConstituency["TANGLIN"] || 0,
    CLEMENTI: votingDetails?.countConstituency["CLEMENTI"] || 0,
    TUAS: votingDetails?.countConstituency["TUAS"] || 0,
    BEDOK: votingDetails?.countConstituency["BEDOK"] || 0,
    MUSEUM: votingDetails?.countConstituency["MUSEUM"] || 0,
    "JURONG EAST": votingDetails?.countConstituency["JURONG EAST"] || 0,
    GEYLANG: votingDetails?.countConstituency["GEYLANG"] || 0,
    "BOON LAY": votingDetails?.countConstituency["BOON LAY"] || 0,
    "BUKIT TIMAH": votingDetails?.countConstituency["BUKIT TIMAH"] || 0,
    NOVENA: votingDetails?.countConstituency["NOVENA"] || 0,
    TAMPINES: votingDetails?.countConstituency["TAMPINES"] || 0,
    "BUKIT BATOK": votingDetails?.countConstituency["BUKIT BATOK"] || 0,
    "JURONG WEST": votingDetails?.countConstituency["JURONG WEST"] || 0,
    SERANGOON: votingDetails?.countConstituency["SERANGOON"] || 0,
    HOUGANG: votingDetails?.countConstituency["HOUGANG"] || 0,
    "PAYA LEBAR": votingDetails?.countConstituency["PAYA LEBAR"] || 0,
    BISHAN: votingDetails?.countConstituency["BISHAN"] || 0,
    "TOA PAYOH": votingDetails?.countConstituency["TOA PAYOH"] || 0,
    "BUKIT PANJANG": votingDetails?.countConstituency["BUKIT PANJANG"] || 0,
    "CHANGI BAY": votingDetails?.countConstituency["CHANGI BAY"] || 0,
    "ANG MO KIO": votingDetails?.countConstituency["ANG MO KIO"] || 0,
    "PASIR RIS": votingDetails?.countConstituency["PASIR RIS"] || 0,
    TENGAH: votingDetails?.countConstituency["TENGAH"] || 0,
    "CHOA CHU KANG": votingDetails?.countConstituency["CHOA CHU KANG"] || 0,
    SENGKANG: votingDetails?.countConstituency["SENGKANG"] || 0,
    CHANGI: votingDetails?.countConstituency["CHANGI"] || 0,
    PUNGGOL: votingDetails?.countConstituency["PUNGGOL"] || 0,
    "SUNGEI KADUT": votingDetails?.countConstituency["SUNGEI KADUT"] || 0,
    YISHUN: votingDetails?.countConstituency["YISHUN"] || 0,
    MANDAI: votingDetails?.countConstituency["MANDAI"] || 0,
    SELETAR: votingDetails?.countConstituency["SELETAR"] || 0,
    WOODLANDS: votingDetails?.countConstituency["WOODLANDS"] || 0,
    "WESTERN WATER CATCHMENT":
      votingDetails?.countConstituency["WESTERN WATER CATCHMENT"] || 0,
    "NORTH-EASTERN ISLANDS":
      votingDetails?.countConstituency["NORTH-EASTERN ISLANDS"] || 0,
    SIMPANG: votingDetails?.countConstituency["SIMPANG"] || 0,
    SEMBAWANG: votingDetails?.countConstituency["SEMBAWANG"] || 0,
    "CENTRAL WATER CATCHMENT":
      votingDetails?.countConstituency["CENTRAL WATER CATCHMENT"] || 0,
    "LIM CHU KANG": votingDetails?.countConstituency["LIM CHU KANG"] || 0,
  };

  return (
    <main
      className="flex flex-col items-center justify-between px-6 py-1 bg-white
        to-slate-700 text-slate-900"
      style={{
        overflow: "hidden",
        justifyContent: "center",
      }}
    >
      <div className="flex flex-col min-h-[88vh] justify-center">
        <div className="self-start ">
          <Link href="/admin">
            <span className="underline text-blue-600">admin</span>
          </Link>
          {" / helios"}
        </div>
        <div className="flex w-full text-white align-middle justify-center">
          <div className="flex min-w- flex-col border border-gray-300 rounded-lg p-4 mr-2">
            <div className="flex flex-col gap-2">
              <h1 className="font-medium text-5x text-slate-900">
                Vote Count Per Hour
              </h1>
              <div className="min-w-[660px] min-h-[270px]">
                <VoteCountBarChartPerHour data={data} />
              </div>
              <h1 className="font-medium text-5x text-slate-900">Map View</h1>
              <div className="min-w[660px] min-h-[270px]">
                <SingaporeMap countsByAreaByHr={countsByAreaByHr} />
              </div>

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
                {sortedNominees.map((nominee, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between my-2 p-2 border rounded-md text-slate-900 shadow-md"
                  >
                    <span className="text-md text-gray-500 ml-2">
                      {idx + 1}
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
                      {nominee.voteCount.toLocaleString() || 0}
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
                            {nominee.voteCount
                              ? (
                                  (nominee.voteCount / totalVotes) *
                                  100
                                ).toFixed(2)
                              : 0}
                            %
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
                            {nominee.voteCount
                              ? (
                                  (nominee.voteCount / totalVotes) *
                                  100
                                ).toFixed(2)
                              : 0}
                            %
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
      </div>
    </main>
  );
}
type SingaporeMapParams = {
  countsByAreaByHr: CountsByAreaByHr;
};
const SingaporeMap = ({ countsByAreaByHr }: SingaporeMapParams) => {
  const maxCount = Math.max(...Object.values(countsByAreaByHr));
  const colorScale = d3.scaleSequential([0, maxCount], d3.interpolateBlues);

  const maxVotesPerArea = Math.max(...Object.values(countsByAreaByHr));
  const maxVotesPerAreaName = Object.keys(countsByAreaByHr).find(
    (key) => countsByAreaByHr[key] === maxVotesPerArea
  );
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
          const count = countsByAreaByHr[d.properties.PLN_AREA_N];
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
  }, [countsByAreaByHr]);

  return (
    <div className="flex flex-col relative justify-center w-full">
      <div ref={mapContainerRef} id="map" className="self-center" />
      {mapContainerRef && (
        <div className="absolute bottom-0 right-0 text-xs text-slate-900">
          <h1>
            Highest: {addComma(maxVotesPerArea)}{" "}
            {maxVotesPerArea === 1 ? "vote" : "votes"}
          </h1>
          <h1 className="capitalize">Location: {maxVotesPerAreaName}</h1>
        </div>
      )}
    </div>
  );
};
