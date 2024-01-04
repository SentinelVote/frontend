import * as d3 from "d3";
import { useEffect } from "react";

type VoteCountBarChartPerHourProps = {
  data: any[];
};

const VoteCountBarChartPerHour = ({ data }: VoteCountBarChartPerHourProps) => {
  useEffect(() => {
    d3.select("#vote_count_per_hr").selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 70, left: 40 },
      width = 660 - margin.left - margin.right, // Increased width
      height = 270 - margin.top - margin.bottom;

    const svg = d3
      .select("#vote_count_per_hr")
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

  return <div id="vote_count_per_hr" />;
};

export default VoteCountBarChartPerHour;
