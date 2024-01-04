import { Nominee } from "@/types/nominee";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
type VotePieChartProps = {
  nominees: Nominee[];
};

const VotePieChart = ({ nominees }: VotePieChartProps) => {
  const COLORS = ["#2563EB", "#FB923C", "#C084FC"];
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) {
    return null;
  }
  return (
    <PieChart width={200} height={200}>
      <Pie
        data={nominees}
        innerRadius={50}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={1}
        dataKey="voteCount"
      >
        {nominees.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default VotePieChart;
