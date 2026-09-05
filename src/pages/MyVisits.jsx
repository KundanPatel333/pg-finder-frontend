import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const MyVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchVisits();
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-6">
        <Link to="/browse" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink mb-4">
          ← Back to browse
        </Link>
        <p className="font-display text-2xl text-ink mb-6">My visits</p>

        {loading && <p className="text-sm text-ink/50">Loading...</p>}
        {!loading && visits.length === 0 && (
          <p className="text-sm text-ink/50">No visits scheduled yet.</p>
        )}
        <div className="flex flex-col gap-3">
          {visits.map((visit) => (
            <div key={visit._id} className="bg-white border border-line rounded-lg p-4">
              <p className="text-sm font-medium text-ink">{visit.pg?.name || "PG"}</p>
              <p className="text-xs text-ink/50">
                Scheduled: {new Date(visit.scheduledDate).toLocaleDateString()}
              </p>
              <p className="text-xs mt-1">
                Status:{" "}
                <span className={visit.status === "confirmed_by_owner" ? "text-primary" : "text-gold"}>
                  {visit.status}
                </span>
              </p>
              <p className="text-xs text-ink/40 mt-1 font-mono">Code: {visit.visitCode}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyVisits;