import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import PGCard from "../components/PGCard";

const ALL_FACILITIES = ["WiFi", "Food", "AC", "Laundry", "Parking", "Housekeeping", "Gym", "Study Room", "Power Backup"];

const Browse = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedFacilities.length > 0) params.facilities = selectedFacilities.join(",");

      const res = await api.get("/pg", { params });
      setListings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedFacilities([]);
    setSearch("");
  };

  // client-side name/address search on top of server-filtered results
  const filteredListings = listings.filter((pg) => {
    const q = search.toLowerCase();
    return (
      pg.name?.toLowerCase().includes(q) || pg.address?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-6">
        <h1 className="text-lg font-semibold text-gray-800 mb-4">
          PGs near Christ University
        </h1>

        {/* Filter panel */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-5">
          <input
            type="text"
            placeholder="Search by name or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-3"
          />

          <div className="flex gap-2 mb-3">
            <input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 border border-gray-200 rounded px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 border border-gray-200 rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {ALL_FACILITIES.map((facility) => (
              <button
                key={facility}
                type="button"
                onClick={() => toggleFacility(facility)}
                className={`text-xs px-3 py-1.5 rounded-full border ${
                  selectedFacilities.includes(facility)
                    ? "bg-gray-800 text-white border-gray-800"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                {facility}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchListings}
              className="bg-gray-800 text-white text-sm px-4 py-2 rounded hover:bg-gray-900"
            >
              Apply filters
            </button>
            <button
              onClick={() => {
                clearFilters();
                fetchListings();
              }}
              className="text-sm text-gray-500 px-4 py-2 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
        </div>

        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {!loading && filteredListings.length === 0 && (
          <p className="text-sm text-gray-500">No PGs match your filters.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredListings.map((pg) => (
            <Link key={pg._id} to={`/pg/${pg._id}`}>
              <PGCard pg={pg} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;