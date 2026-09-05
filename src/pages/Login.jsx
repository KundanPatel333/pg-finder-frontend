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
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12">
        <p className="font-display text-2xl text-paper">PG Finder</p>
        <div>
          <p className="font-display text-3xl text-paper leading-snug mb-4">
            {role === "owner"
              ? "List your rooms. Meet real students."
              : "Find a room you'll actually want to live in."}
          </p>
          <p className="text-paper/70 text-sm max-w-sm">
            Near Christ University, Bangalore — verified visits, no middlemen.
          </p>
        </div>
        <p className="text-paper/50 text-xs">© 2026 PG Finder</p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-paper px-6 py-16">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink mb-8">
            ← Back
          </Link>
          <p className="font-display text-2xl text-ink mb-1">
            {role === "owner" ? "Owner login" : "Student login"}
          </p>
          <p className="text-sm text-ink/50 mb-8">Welcome back — enter your details.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark disabled:opacity-50 mt-2"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-sm text-ink/50 mt-6 text-center">
            No account? <Link to={`/signup?role=${role}`} className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;