import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
      <div className="min-h-screen bg-paper">
        <Navbar />
        <p className="text-sm text-ink/50 px-6 py-6">Loading...</p>
      </div>
    );
  }

  if (!pg) return null;

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-6">
        <Link to="/browse" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink mb-4">
          ← Back to browse
        </Link>

        {pg.images?.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {pg.images.map((url, i) => (
              <img key={i} src={url} alt={`${pg.name}-${i}`} className="w-full h-40 object-cover rounded-lg" />
            ))}
          </div>
        )}
        <p className="font-display text-2xl text-ink">{pg.name}</p>
        <p className="text-sm text-ink/50 mb-2">{pg.address}</p>
        <p className="text-sm text-ink mb-2">₹{pg.priceRange?.min} - ₹{pg.priceRange?.max}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {pg.facilities?.map((f) => (
            <span key={f} className="text-xs bg-line/40 text-ink/70 px-2 py-1 rounded">{f}</span>
          ))}
        </div>
        <p className="text-xs text-ink/40 mb-4">{pg.interestedCount || 0} students interested</p>

        {hasVisit && pg.owner?.phone && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-ink/60">Owner contact (unlocked after scheduling a visit):</p>
            <p className="text-sm font-medium text-primary-dark">{pg.owner.name} — {pg.owner.phone}</p>
          </div>
        )}

        <div className="bg-white border border-line rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-ink mb-2">Mark as interested</p>
          <textarea
            placeholder="Any notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-line rounded-md px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            rows={2}
          />
          <button
            onClick={handleInterest}
            className="bg-primary text-white text-sm px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            I'm interested
          </button>
        </div>

        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-sm font-medium text-ink mb-1">Schedule a visit</p>
          {!hasVisit && (
            <p className="text-xs text-ink/40 mb-2">
              Owner's contact details will be shared once you schedule a visit.
            </p>
          )}
          {hasVisit ? (
            <p className="text-xs text-ink/50">You already have a visit scheduled for this PG.</p>
          ) : (
            <>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-line rounded-md px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <button
                onClick={handleScheduleVisit}
                className="bg-primary text-white text-sm px-4 py-2 rounded-md hover:bg-primary-dark"
              >
                Schedule visit
              </button>
            </>
          )}

          {visitCode && (
            <div className="mt-3 bg-gold/10 border border-gold/40 rounded-md p-3">
              <p className="text-xs text-ink/60">Your visit code:</p>
              <p className="text-lg font-mono font-semibold text-ink">{visitCode}</p>
              <p className="text-xs text-ink/50 mt-1">Show this to the PG owner during your visit.</p>
            </div>
          )}
        </div>

        {message && <p className="text-xs text-primary mt-3">{message}</p>}
        {error && <p className="text-xs text-red-600 mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default PGDetail;