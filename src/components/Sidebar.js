import { NavLink } from "react-router-dom";
import { logout } from "../utils/auth";

function Sidebar() {
  const base = "block px-4 py-2 rounded hover:bg-blue-100";
  const active = "bg-blue-600 text-white";

  return (
    <div className="w-64 bg-white h-screen shadow flex flex-col">
      {/* HEADER */}
      <h2 className="text-xl font-bold p-6 border-b">
        CRM System
      </h2>

      {/* NAV */}
      <nav className="p-4 space-y-2 flex-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${base} ${isActive ? active : ""}`
          }
        >
          📋 Dashboard
        </NavLink>

        <NavLink
          to="/activity"
          className={({ isActive }) =>
            `${base} ${isActive ? active : ""}`
          }
        >
          🕒 Activity
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `${base} ${isActive ? active : ""}`
          }
        >
          📊 Analytics
        </NavLink>
      </nav>

      {/* LOGOUT */}
      <div className="p-4">
        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
