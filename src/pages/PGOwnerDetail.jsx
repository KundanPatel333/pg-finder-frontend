import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const PGOwnerDetail = () => {
  const { id } = useParams();
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPg = async () => {
      try {
        const res = await api.get(`/pg/${id}`);
        setPg(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPg();
  }, [id]);

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
        <Link to="/dashboard" className="text-xs text-gray-500 underline">
          ← Back to dashboard
        </Link>

        {pg.images?.length > 0 && (
          <div className="grid grid-cols-2 gap-2 my-4">
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

        <h1 className="text-xl font-semibold text-gray-800 mt-2">{pg.name}</h1>
        <p className="text-sm text-gray-500 mb-2">{pg.address}</p>
        <p className="text-sm text-gray-700 mb-2">
          ₹{pg.priceRange?.min} - ₹{pg.priceRange?.max}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {pg.facilities?.map((f) => (
            <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {f}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400">{pg.interestedCount || 0} students interested</p>
      </div>
    </div>
  );
};

export default PGOwnerDetail;