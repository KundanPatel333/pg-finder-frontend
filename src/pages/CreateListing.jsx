import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import imageCompression from "browser-image-compression";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const CreateListing = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    min: "",
    max: "",
    facilities: "",
  });
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setCompressing(true);
    setError("");
    try {
      const compressedFiles = await Promise.all(
        files.map((file) =>
          imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1600,
            useWebWorker: true,
          })
        )
      );
      setImages(compressedFiles);
      setPreview(compressedFiles.map((f) => URL.createObjectURL(f)));
    } catch (err) {
      console.error(err);
      setError("Could not process images, try smaller files");
    } finally {
      setCompressing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.address.trim()) {
      setError("Name and address are required");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/pg", {
        name: form.name,
        address: form.address,
        priceRange: { min: Number(form.min), max: Number(form.max) },
        facilities: form.facilities.split(",").map((f) => f.trim()).filter(Boolean),
      });

      const pgId = res.data._id;

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((file) => formData.append("images", file));
        await api.post(`/pg/${pgId}/images`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Could not create listing";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink mb-4">
          ← Back to dashboard
        </Link>
        <p className="font-display text-2xl text-ink mb-6">Add a new PG</p>

        <form onSubmit={handleSubmit} className="bg-white border border-line rounded-lg p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1">PG name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-line rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border border-line rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-xs font-medium text-ink/70 mb-1">Min price</label>
              <input
                name="min"
                type="number"
                value={form.min}
                onChange={handleChange}
                className="w-full border border-line rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-medium text-ink/70 mb-1">Max price</label>
              <input
                name="max"
                type="number"
                value={form.max}
                onChange={handleChange}
                className="w-full border border-line rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1">Facilities</label>
            <input
              name="facilities"
              placeholder="WiFi, Food, AC"
              value={form.facilities}
              onChange={handleChange}
              className="w-full border border-line rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1">Photos (up to 5)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="w-full text-sm"
            />
            {compressing && <p className="text-xs text-ink/40 mt-1">Optimizing images...</p>}
          </div>

          {preview.length > 0 && !compressing && (
            <div className="grid grid-cols-3 gap-2">
              {preview.map((src, i) => (
                <img key={i} src={src} alt={`preview-${i}`} className="w-full h-20 object-cover rounded" />
              ))}
            </div>
          )}

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || compressing}
            className="w-full bg-primary text-white py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;