import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const isOwner = user?.role === "owner";

  const links = isOwner
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/visits", label: "Visits" },
        { to: "/create", label: "Add PG" },
      ]
    : [
        { to: "/browse", label: "Browse" },
        { to: "/my-visits", label: "My Visits" },
      ];

  return (
    <nav className="bg-primary relative z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <Link
          to={isOwner ? "/dashboard" : "/browse"}
          className="text-lg font-display text-paper"
          onClick={() => setMenuOpen(false)}
        >
          PG Finder {isOwner ? "— Owner" : ""}
        </Link>

        {user && (
          <>
            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-paper/80 hover:text-paper"
                >
                  {link.label}
                </Link>
              ))}
              <NotificationBell />
              <button
                onClick={handleLogout}
                className="text-sm text-gold hover:text-paper"
              >
                Logout
              </button>
            </div>

            {/* Mobile: bell + hamburger */}
            <div className="flex items-center gap-3 md:hidden">
              <NotificationBell />
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="text-paper"
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {user && menuOpen && (
        <div className="md:hidden border-t border-primary-dark bg-primary px-4 py-3 flex flex-col gap-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-paper/80 hover:text-paper"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-sm text-gold hover:text-paper text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;