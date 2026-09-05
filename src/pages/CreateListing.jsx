import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const files = Array.from(e.target.files).slice(0, 5); // max 5
    setCompressing(true);
    setError("");
    try {
      const compressedFiles = await Promise.all(
        files.map((file) =>
          imageCompression(file, {
            maxSizeMB: 1, // target max 1MB per image
            maxWidthOrHeight: 1600, // good enough for web display
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-8">
        <h1 className="text-lg font-semibold text-gray-800 mb-4">Add a new PG</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
          <input
            name="name"
            placeholder="PG name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-3"
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-3"
          />
          <div className="flex gap-2 mb-3">
            <input
              name="min"
              type="number"
              placeholder="Min price"
              value={form.min}
              onChange={handleChange}
              className="w-1/2 border border-gray-200 rounded px-3 py-2 text-sm"
            />
            <input
              name="max"
              type="number"
              placeholder="Max price"
              value={form.max}
              onChange={handleChange}
              className="w-1/2 border border-gray-200 rounded px-3 py-2 text-sm"
            />
          </div>
          <input
            name="facilities"
            placeholder="Facilities (comma separated: WiFi, Food, AC)"
            value={form.facilities}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-3"
          />

          <label className="block text-sm text-gray-700 mb-1">Photos (up to 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="w-full text-sm mb-1"
          />
          {compressing && (
            <p className="text-xs text-gray-400 mb-2">Optimizing images...</p>
          )}

          {preview.length > 0 && !compressing && (
            <div className="grid grid-cols-3 gap-2 mb-3 mt-2">
              {preview.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`preview-${i}`}
                  className="w-full h-20 object-cover rounded"
                />
              ))}
            </div>
          )}

          {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
          <button
            type="submit"
            disabled={loading || compressing}
            className="w-full bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;