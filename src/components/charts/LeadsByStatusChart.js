import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#2563eb", "#f59e0b", "#16a34a"];

function LeadsByStatusChart({ data }) {
  if (!data) {
    return (
      <div className="bg-white p-6 rounded shadow h-[350px]">
        Loading chart...
      </div>
    );
  }

  const chartData = [
    { name: "New", value: data.new },
    { name: "Contacted", value: data.contacted },
    { name: "Converted", value: data.converted },
  ];

  return (
    <div className="bg-white p-6 rounded shadow h-[350px]">
      <h2 className="font-semibold mb-4">Leads by Status</h2>

      {/* ✅ FIXED SIZE — NO ResponsiveContainer */}
      <PieChart width={300} height={250}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default LeadsByStatusChart;
