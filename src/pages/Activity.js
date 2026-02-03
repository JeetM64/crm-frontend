import { useEffect, useState } from "react";
import api from "../services/api";

function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/activity")
      .then((res) => setActivities(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading activity...</div>;
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Activity Timeline</h1>

      {activities.length === 0 ? (
        <p className="text-gray-500">No activity yet.</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((a) => (
            <li
              key={a.id}
              className="bg-white p-4 rounded shadow flex justify-between"
            >
              <div>
                <p className="font-medium">{a.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>

              <span className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700">
                {a.action}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Activity;
