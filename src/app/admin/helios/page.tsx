"use client";
import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
// import SingaporeJSON from "./data/singapore-planning-areas-topojson.json";
export interface Voter {
  firstName: string;
  lastName: string;
  userEmail: string;
  region: string;
  publicKey: string;
}

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
  type Nominee = {
    id: number;
    name: string;
    party: string;
    totalVotes: number;
  };

  const nominees: Nominee[] = [
    {
      id: 1,
      name: "Tharman Shanmugaratnam",
      party: "Independent",
      totalVotes: 600000,
    },
    { id: 2, name: "Tan Kin Lian", party: "Independent", totalVotes: 220000 },
    { id: 3, name: "Ng Kok Song", party: "Independent", totalVotes: 180000 },
  ];

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
      className="flex flex-col items-center justify-between px-6 py-6 bg-white
        to-slate-700 text-slate-900"
      style={{
        minHeight: "90vh",
        overflow: "hidden",
        justifyContent: "center",
      }}
    >
      <div className="flex w-full text-white">
        <div className="flex flex-col border border-gray-300 rounded-lg p-4 mr-2">
          <div className="flex flex-col gap-2">
            <h1 className="font-medium text-5x text-slate-900">
              Vote Count Per Hour
            </h1>
            <VoteCountBarChart />
            <h1 className="font-medium text-5x text-slate-900">Map View</h1>
            {/* <SingaporeMap /> */}
            <div
              style={{
                width: "660px",
                height: "270px",
                borderRadius: "10px",
                backgroundColor: "gray",
                opacity: "0.2",
              }}
            ></div>
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
                    <div className="flex-shrink-0 h-12 w-12 overflow-hidden rounded-full border mr-4">
                      {/* <img
                        src="/path-to-your-image.jpg"
                        alt="profile"
                        className="h-full w-full object-cover"
                      /> */}
                    </div>
                    <div>
                      <span className="text-sm">{nominee.name}</span>
                    </div>
                  </div>
                  <span className="text-sm">{nominee.party}</span>
                  <span className="text-sm">
                    {nominee.totalVotes.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* <MyD3Component /> */}
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
                  backgroundColor: "gray",
                  opacity: "0.2",
                }}
              ></div>
            </div>
            <div className="border border-gray-300 rounded-lg p-4">
              <h1 className="font-medium text-5x text-slate-900 ">
                Vote Count
              </h1>{" "}
              <div
                style={{
                  width: "270px",
                  height: "270px",
                  borderRadius: "10px",
                  backgroundColor: "gray",
                  opacity: "0.2",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

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

const VoteCountBarChart: React.FC = () => {
  useEffect(() => {
    d3.select("#my_dataviz").selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 70, left: 40 },
      width = 660 - margin.left - margin.right, // Increased width
      height = 270 - margin.top - margin.bottom;

    const svg = d3
      .select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up the X-axis scale
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.Hour))
      .padding(0.2);
    // Append X-axis to the SVG
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      //   .selectAll("text")
      //   .attr("transform", "translate(10,0)")
      //   .style("text-anchor", "end")
      .style("color", "#000");

    // Set up the scales with proper type assertions
    const maxYValue = d3.max(data, (d) => d.Count) ?? 0;

    // Set up the Y-axis scale
    const y = d3.scaleLinear().domain([0, maxYValue]).range([height, 0]);

    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .tickSize(-width)
          .tickFormat("" as any)
      )
      .selectAll("line")
      .style("stroke", "#e8e8e8")
      .style("stroke-opacity", "0.7")
      .style("shape-rendering", "crispEdges");

    // Append Y-axis to the SVG
    svg.append("g").call(d3.axisLeft(y)).style("color", "#000");

    const colorScale = d3.scaleSequential((d) =>
      d3.interpolateBlues(d / maxYValue)
    );
    // Draw the bars
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.Hour)!)
      .attr("y", (d) => y(d.Count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.Count))
      .attr("fill", (d) => colorScale(d.Count))
      .attr("border-radius", "10px");
    // Use the color scale for fill
  }, [data]);

  return <div id="my_dataviz" />;
};

const SingaporeMap: React.FC = () => {
  d3.select("#map").selectAll("*").remove();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const width = 800; // or use the container's width if dynamic sizing is required
    const height = 600; // or use the container's height if dynamic sizing is required
    d3.select("#map").selectAll("*").remove();
    // Fetch the GeoJSON data using the public URL path
    fetch(
      "https://raw.githubusercontent.com/hvo/datasets/master/nyc_zip.geojson"
    )
      .then((response) => response.json())
      .then((data: any) => {
        if (mapContainerRef.current && data.features) {
          // Now we have a valid GeoJSON object
          const projection = d3.geoMercator().fitSize([width, height], data);
          const pathGenerator = d3.geoPath().projection(projection);

          const svg = d3
            .select(mapContainerRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

          svg
            .selectAll(".area")
            .data(data.features)
            .enter()
            .append("path")
            .attr("class", "area")
            // Type assertion here to inform TypeScript about the type
            .attr("d", (d: any) => pathGenerator(d as d3.GeoPermissibleObjects))
            .attr("fill", "#69b3a2");
        }
      })
      .catch((error) => {
        console.error("Error fetching the GeoJSON data: ", error);
      });
  }, []);

  return <div ref={mapContainerRef} id="map" />;
};
