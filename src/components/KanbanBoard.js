function KanbanBoard({ leads, onStatusChange, onOpenNotes }) {
  const columns = [
    { key: "new", title: "New" },
    { key: "contacted", title: "Contacted" },
    { key: "converted", title: "Converted" }
  ];

  const nextStatus = {
    new: "contacted",
    contacted: "converted"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => (
        <div key={col.key} className="bg-gray-100 rounded-xl p-4">
          <h3 className="font-semibold text-center mb-4">
            {col.title}
          </h3>

          <div className="space-y-3">
            {leads.filter((l) => l.status === col.key).length === 0 && (
              <p className="text-center text-gray-400 text-sm">
                No leads
              </p>
            )}

            {leads
              .filter((l) => l.status === col.key)
              .map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-gray-500">
                        {lead.email}
                      </p>
                      <p className="text-xs text-gray-400">
                        Source: {lead.source}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        lead.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : lead.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {lead.priority}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <button
                      onClick={() => onOpenNotes(lead)}
                      className="text-blue-600 text-sm"
                    >
                      Notes
                    </button>

                    {col.key !== "converted" && (
                      <button
                        onClick={() =>
                          onStatusChange(lead.id, nextStatus[col.key])
                        }
                        className="bg-blue-600 text-white text-xs px-3 py-1 rounded"
                      >
                        Move →
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KanbanBoard;
