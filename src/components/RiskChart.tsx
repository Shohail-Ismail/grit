import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface RiskChartProps {
  factors: {
    flood: number;
    wildfire: number;
    storm: number;
    drought: number;
  };
}

const RiskChart = ({ factors }: RiskChartProps) => {
  const data = [
    { name: "Flood", value: factors.flood, color: "hsl(var(--chart-1))" },
    { name: "Wildfire", value: factors.wildfire, color: "hsl(var(--chart-2))" },
    { name: "Storm", value: factors.storm, color: "hsl(var(--chart-3))" },
    { name: "Drought", value: factors.drought, color: "hsl(var(--chart-4))" },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-card-foreground">Risk Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))", 
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px"
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RiskChart;
