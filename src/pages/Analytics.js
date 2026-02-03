import { useEffect, useState } from "react";
import api from "../services/api";
import LeadsByStatusChart from "../components/charts/LeadsByStatusChart";
import LeadsBySourceChart from "../components/charts/LeadsBySourceChart";

function Analytics() {
  const [stats, setStats] = useState(null);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [summaryRes, sourcesRes] = await Promise.all([
          api.get("/leads/analytics/summary"),
          api.get("/leads/analytics/sources"),
        ]);

        setStats(summaryRes.data);
        setSources(sourcesRes.data || []);
      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  if (!stats) {
    return <div className="p-6 text-red-500">Failed to load analytics</div>;
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Leads" value={stats.total} />
        <StatCard title="New" value={stats.new} />
        <StatCard title="Contacted" value={stats.contacted} />
        <StatCard title="Converted" value={stats.converted} />
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">
        <LeadsByStatusChart data={stats} />
        {sources.length > 0 && (
          <LeadsBySourceChart sources={sources} />
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default Analytics;
