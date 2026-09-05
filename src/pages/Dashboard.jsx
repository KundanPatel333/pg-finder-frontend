import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import PGCard from "../components/PGCard";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get("/pg");
        const own = res.data.filter((pg) => pg.owner?._id === user._id || pg.owner === user._id);
        setListings(own);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-800">Your listings</h1>
          <Link
            to="/create"
            className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded hover:bg-gray-900"
          >
            + Add PG
          </Link>
        </div>

        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {!loading && listings.length === 0 && (
          <p className="text-sm text-gray-500">No listings yet — add your first PG.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {listings.map((pg) => (
           <PGCard key={pg._id} pg={pg} linkTo={`/pg-owner/${pg._id}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;