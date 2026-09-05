import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const PGDetail = () => {
  const { id } = useParams();
  const [pg, setPg] = useState(null);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [visitCode, setVisitCode] = useState("");
  const [hasVisit, setHasVisit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pgRes, visitsRes] = await Promise.all([
          api.get(`/pg/${id}`),
          api.get("/visits/my"),
        ]);
        setPg(pgRes.data);

        const existingVisit = visitsRes.data.find((v) => v.pg?._id === id || v.pg === id);
        if (existingVisit) {
          setHasVisit(true);
          setVisitCode(existingVisit.visitCode);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleInterest = async () => {
    setError("");
    setMessage("");
    try {
      await api.post(`/pg/${id}/interest`, { notes });
      setMessage("Marked as interested!");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleScheduleVisit = async () => {
    setError("");
    setMessage("");
    if (!date) {
      setError("Pick a visit date first");
      return;
    }
    try {
      const res = await api.post("/visits", { pgId: id, scheduledDate: date });
      setVisitCode(res.data.visitCode);
      setHasVisit(true);
      setMessage("Visit scheduled! Show this code to the owner during your visit.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-sm text-gray-500 px-6 py-6">Loading...</p>
      </div>
    );
  }

  if (!pg) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-6">
        {pg.images?.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {pg.images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${pg.name}-${i}`}
                className="w-full h-40 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
        <h1 className="text-xl font-semibold text-gray-800">{pg.name}</h1>
        <p className="text-sm text-gray-500 mb-2">{pg.address}</p>
        <p className="text-sm text-gray-700 mb-2">
          ₹{pg.priceRange?.min} - ₹{pg.priceRange?.max}
        </p>
        <div className="flex flex-wrap gap-2 mb-2">
          {pg.facilities?.map((f) => (
            <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {f}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mb-4">{pg.interestedCount || 0} students interested</p>

        {hasVisit && pg.owner?.phone && (
          <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
            <p className="text-xs text-gray-600">Owner contact (unlocked after scheduling a visit):</p>
            <p className="text-sm font-medium text-green-800">{pg.owner.name} — {pg.owner.phone}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Mark as interested</h3>
          <textarea
            placeholder="Any notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-2"
            rows={2}
          />
          <button
            onClick={handleInterest}
            className="bg-gray-800 text-white text-sm px-4 py-2 rounded hover:bg-gray-900"
          >
            I'm interested
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-1">Schedule a visit</h3>
{!hasVisit && (
  <p className="text-xs text-gray-400 mb-2">
    Owner's contact details will be shared once you schedule a visit.
  </p>
)}
          {hasVisit ? (
            <p className="text-xs text-gray-500">You already have a visit scheduled for this PG.</p>
          ) : (
            <>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-2"
              />
              <button
                onClick={handleScheduleVisit}
                className="bg-gray-800 text-white text-sm px-4 py-2 rounded hover:bg-gray-900"
              >
                Schedule visit
              </button>
            </>
          )}

          {visitCode && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded p-3">
              <p className="text-xs text-gray-600">Your visit code:</p>
              <p className="text-lg font-mono font-semibold text-amber-800">{visitCode}</p>
              <p className="text-xs text-gray-500 mt-1">Show this to the PG owner during your visit.</p>
            </div>
          )}
        </div>

        {message && <p className="text-xs text-green-600 mt-3">{message}</p>}
        {error && <p className="text-xs text-red-600 mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default PGDetail;