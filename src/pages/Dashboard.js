import { useEffect, useState } from "react";
import api from "../services/api";
import KanbanBoard from "../components/KanbanBoard";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("table");

  const [leads, setLeads] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [priority, setPriority] = useState("medium");

  const [selectedLead, setSelectedLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");

  /* ================= FETCH LEADS ================= */
  const fetchLeads = async () => {
  try {
    setLoading(true);
    const res = await api.get("/leads");
    setLeads(res.data);
  } catch (err) {
    console.error(err);
    setError("Backend not reachable");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchLeads();
  }, []);

  /* ================= CREATE LEAD ================= */
  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!name || !email || !source) {
      setError("All fields are required");
      return;
    }

    try {
      await api.post("/leads", { name, email, source, priority });
      setName("");
      setEmail("");
      setSource("");
      setPriority("medium");
      fetchLeads();
    } catch {
      setError("Failed to create lead");
    }
  };

  /* ================= EXPORT CSV ================= */
  const handleExportCSV = async () => {
    try {
      const res = await api.get("/leads/export/csv", {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "leads.csv";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Failed to export CSV");
    }
  };

  /* ================= STATUS ================= */
  const handleStatusChange = async (id, status) => {
    await api.put(`/leads/${id}`, { status });
    fetchLeads();
  };

  /* ================= DELETE ================= */
  const handleDeleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    await api.delete(`/leads/${id}`);
    fetchLeads();
  };

  /* ================= NOTES ================= */
  const openNotes = async (lead) => {
    setSelectedLead(lead);
    const res = await api.get(`/notes/${lead.id}`);
    setNotes(res.data);
  };

  const closeNotes = () => {
    setSelectedLead(null);
    setNotes([]);
    setNoteText("");
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    await api.post(`/notes/${selectedLead.id}`, { note: noteText });
    openNotes(selectedLead);
    setNoteText("");
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
  );

  const stat = (s) => leads.filter((l) => l.status === s).length;

  return (
    /* 🔥 IMPORTANT: no sidebar, no ml-64, no mx-auto */
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total" value={leads.length} />
        <StatCard title="New" value={stat("new")} />
        <StatCard title="Contacted" value={stat("contacted")} />
        <StatCard title="Converted" value={stat("converted")} />
      </div>

      {/* ADD LEAD */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <form
          className="grid md:grid-cols-5 gap-4"
          onSubmit={handleCreateLead}
        >
          <Input placeholder="Name" value={name} onChange={setName} />
          <Input placeholder="Email" value={email} onChange={setEmail} />
          <Input placeholder="Source" value={source} onChange={setSource} />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button className="bg-blue-600 text-white rounded">
            Add Lead
          </button>
        </form>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          className="border px-4 py-2 rounded w-full md:w-1/3"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={handleExportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>

        <button
          onClick={() => setView(view === "table" ? "kanban" : "table")}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Switch to {view === "table" ? "Kanban" : "Table"}
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-center py-10">Loading...</p>
      ) : view === "kanban" ? (
        <KanbanBoard
          leads={filteredLeads}
          onStatusChange={handleStatusChange}
          onOpenNotes={openNotes}
        />
      ) : (
        <LeadsTable
          leads={filteredLeads}
          onStatusChange={handleStatusChange}
          onOpenNotes={openNotes}
          onDelete={handleDeleteLead}
        />
      )}

      {/* NOTES PANEL */}
      {selectedLead && (
        <NotesPanel
          lead={selectedLead}
          notes={notes}
          noteText={noteText}
          setNoteText={setNoteText}
          onAdd={handleAddNote}
          onClose={closeNotes}
        />
      )}
    </div>
  );
}

/* ===== Helper Components ===== */

function Input({ placeholder, value, onChange }) {
  return (
    <input
      className="border px-4 py-2 rounded"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
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

function LeadsTable({ leads, onStatusChange, onOpenNotes, onDelete }) {
  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th>Email</th>
            <th>Source</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} className="border-t">
              <td className="p-3">{l.name}</td>
              <td>{l.email}</td>
              <td>{l.source}</td>
              <td>
                <select
                  value={l.status}
                  onChange={(e) =>
                    onStatusChange(l.id, e.target.value)
                  }
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                </select>
              </td>
              <td className="space-x-2">
                <button onClick={() => onOpenNotes(l)}>Notes</button>
                <button onClick={() => onDelete(l.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NotesPanel({ lead, notes, noteText, setNoteText, onAdd, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end">
      <div className="bg-white w-full md:w-1/3 p-6">
        <h2 className="font-bold mb-3">
          Notes – {lead.name}
        </h2>

        <input
          className="border w-full mb-2"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />

        <button onClick={onAdd}>Add</button>

        <ul className="mt-2">
          {notes.map((n) => (
            <li key={n.id}>{n.note}</li>
          ))}
        </ul>

        <button className="mt-4" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
