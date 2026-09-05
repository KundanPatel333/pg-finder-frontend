import { useState } from "react";
import api from "../api/axios";

const VisitCard = ({ visit, onConfirmed }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!code.trim()) {
      setError("Enter the visit code first");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.patch(`/visits/${visit._id}/confirm`, { code });
      onConfirmed(visit._id);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <p className="text-sm text-gray-800 font-medium">
        {visit.student?.name || "Student"} — {visit.pg?.name || "PG"}
      </p>
      <p className="text-xs text-gray-500">
        Scheduled: {new Date(visit.scheduledDate).toLocaleDateString()}
      </p>
      <p className="text-xs mt-1">
        Status:{" "}
        <span
          className={
            visit.status === "confirmed_by_owner"
              ? "text-green-600"
              : "text-amber-600"
          }
        >
          {visit.status}
        </span>
      </p>

      {visit.status === "pending" && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter visit code"
            className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm"
          />
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-gray-800 text-white text-sm px-3 py-1 rounded hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "..." : "Confirm"}
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default VisitCard;