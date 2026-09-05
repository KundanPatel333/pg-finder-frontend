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

  const filteredListings = listings.filter((pg) => {
    const q = search.toLowerCase();
    return pg.name?.toLowerCase().includes(q) || pg.address?.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <p className="font-display text-2xl text-ink mb-6">PGs near Christ University</p>

        <div className="bg-white border border-line rounded-lg p-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-line rounded-md px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />

          <div className="flex gap-2 mb-3">
            <input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
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
                    ? "bg-primary text-white border-primary"
                    : "border-line text-ink/60"
                }`}
              >
                {facility}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchListings}
              className="bg-primary text-white text-sm px-4 py-2 rounded-md hover:bg-primary-dark"
            >
              Apply filters
            </button>
            <button
              onClick={() => {
                clearFilters();
                fetchListings();
              }}
              className="text-sm text-ink/50 px-4 py-2 hover:text-ink"
            >
              Clear
            </button>
          </div>
        </div>

        {loading && <p className="text-sm text-ink/50">Loading...</p>}
        {!loading && filteredListings.length === 0 && (
          <p className="text-sm text-ink/50">No PGs match your filters.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredListings.map((pg) => (
            <PGCard key={pg._id} pg={pg} linkTo={`/pg/${pg._id}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;