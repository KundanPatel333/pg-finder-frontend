import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import VisitCard from "../components/VisitCard";

const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVisits = async () => {
    try {
      const res = await api.get("/visits/my");
      setVisits(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleConfirmed = (visitId) => {
    setVisits((prev) =>
      prev.map((v) => (v._id === visitId ? { ...v, status: "confirmed_by_owner" } : v))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-6">
        <h1 className="text-lg font-semibold text-gray-800 mb-4">Scheduled visits</h1>
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {!loading && visits.length === 0 && (
          <p className="text-sm text-gray-500">No visits scheduled yet.</p>
        )}
        <div className="flex flex-col gap-3">
          {visits.map((visit) => (
            <VisitCard key={visit._id} visit={visit} onConfirmed={handleConfirmed} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Visits;