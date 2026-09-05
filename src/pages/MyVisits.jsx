import { useEffect, useState } from "react";
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-6">
        <h1 className="text-lg font-semibold text-gray-800 mb-4">My visits</h1>
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {!loading && visits.length === 0 && (
          <p className="text-sm text-gray-500">No visits scheduled yet.</p>
        )}
        <div className="flex flex-col gap-3">
          {visits.map((visit) => (
            <div key={visit._id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <p className="text-sm font-medium text-gray-800">{visit.pg?.name || "PG"}</p>
              <p className="text-xs text-gray-500">
                Scheduled: {new Date(visit.scheduledDate).toLocaleDateString()}
              </p>
              <p className="text-xs mt-1">
                Status:{" "}
                <span
                  className={
                    visit.status === "confirmed_by_owner" ? "text-green-600" : "text-amber-600"
                  }
                >
                  {visit.status}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1 font-mono">Code: {visit.visitCode}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyVisits;