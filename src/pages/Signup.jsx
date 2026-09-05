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
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12">
        <p className="font-display text-2xl text-paper">PG Finder</p>
        <div>
          <p className="font-display text-3xl text-paper leading-snug mb-4">
            {role === "owner"
              ? "Your rooms, in front of the right students."
              : "Your next room is closer than you think."}
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
            {role === "owner" ? "Create owner account" : "Create student account"}
          </p>
          <p className="text-sm text-ink/50 mb-8">Takes less than a minute.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/70 mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91"
                className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark disabled:opacity-50 mt-2"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-sm text-ink/50 mt-6 text-center">
            Already have an account? <Link to={`/login?role=${role}`} className="text-primary font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;