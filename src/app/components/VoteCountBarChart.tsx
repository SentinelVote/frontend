import { Nominee } from "@/types/nominee";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
type VoteCountBarChartProps = {
  nominees: Nominee[];
};
const VoteCountBarChart = ({ nominees }: VoteCountBarChartProps) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) {
    return null;
  }
  return (
    <BarChart
      width={270}
      height={170}
      data={nominees}
      margin={{
        top: 10,
        right: 30,
        left: 20,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="id" fontSize="12px" />
      <YAxis fontSize="10px" />
      <Tooltip />

      <Bar dataKey="voteCount">
        {nominees.map((nominee, index) => (
          <Cell key={`cell-${index}`} fill={nominee.color} />
        ))}
      </Bar>
    </BarChart>
  );
};

export default VoteCountBarChart;
