import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isOwner = user?.role === "owner";

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <Link to={isOwner ? "/dashboard" : "/browse"} className="text-lg font-semibold text-gray-800">
        PG Finder {isOwner ? "— Owner" : ""}
      </Link>
      {user && (
        <div className="flex items-center gap-4">
          {isOwner ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link to="/visits" className="text-sm text-gray-600 hover:text-gray-900">Visits</Link>
              <Link to="/create" className="text-sm text-gray-600 hover:text-gray-900">Add PG</Link>
            </>
          ) : (
            <>
              <Link to="/browse" className="text-sm text-gray-600 hover:text-gray-900">Browse</Link>
              <Link to="/my-visits" className="text-sm text-gray-600 hover:text-gray-900">My Visits</Link>
            </>
          )}
           <NotificationBell />
          <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;