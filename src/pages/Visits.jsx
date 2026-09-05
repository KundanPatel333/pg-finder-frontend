import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink mb-4">
          ← Back to dashboard
        </Link>
        <p className="font-display text-2xl text-ink mb-6">Scheduled visits</p>

        {loading && <p className="text-sm text-ink/50">Loading...</p>}
        {!loading && visits.length === 0 && (
          <p className="text-sm text-ink/50">No visits scheduled yet.</p>
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