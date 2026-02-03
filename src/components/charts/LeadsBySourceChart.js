import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function LeadsBySourceChart({ sources }) {
  if (!sources || sources.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow h-[350px]">
        No data available
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow h-[350px]">
      <h2 className="font-semibold mb-4">Leads by Source</h2>

      {/* ✅ FIXED SIZE — NO ResponsiveContainer */}
      <BarChart width={400} height={250} data={sources}>
        <XAxis dataKey="source" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#2563eb" />
      </BarChart>
    </div>
  );
}

export default LeadsBySourceChart;
