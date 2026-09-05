import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "student";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data, res.data.token);
      navigate(res.data.role === "owner" ? "/dashboard" : "/browse");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
          {role === "owner" ? "Owner Login" : "Student Login"}
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          <Link to="/" className="underline">Not a {role}? Go back</Link>
        </p>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-3"
        />
        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-xs text-gray-500 mt-3 text-center">
          No account? <Link to={`/signup?role=${role}`} className="text-gray-800 underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;