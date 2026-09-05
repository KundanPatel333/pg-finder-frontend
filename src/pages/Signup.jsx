import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "student";
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", { ...form, role });
      login(res.data, res.data.token);
      navigate(res.data.role === "owner" ? "/dashboard" : "/browse");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Signup failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-sm w-full max-w-sm"
      >
        <h2 className="text-lg font-semibold mb-1 text-gray-800">
          {role === "owner" ? "Owner Signup" : "Student Signup"}
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          <Link to="/" className="underline">Not a {role}? Go back</Link>
        </p>
        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-3"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-3"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-3"
        />
        <input
          name="phone"
          placeholder="Phone (+91...)"
          value={form.phone}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-3"
        />
        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Already have an account? <Link to={`/login?role=${role}`} className="text-gray-800 underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;