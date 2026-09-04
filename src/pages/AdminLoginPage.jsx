import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await login(email, password);
    if (error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-24">
      <h1 className="text-2xl font-display font-medium text-ink mb-8 text-center">
        Admin Login
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral/50"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full rounded-xl border border-blush bg-white px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-coral/50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-coral transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral text-white px-8 py-3 rounded-full font-medium hover:bg-clay transition-colors disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
        {error && <p className="text-clay text-sm text-center">{error}</p>}
      </form>
    </div>
  );
}
