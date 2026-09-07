import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetSending, setResetSending] = useState(false);

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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetSending(true);
    setResetMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    setResetSending(false);
    setResetMessage(
      error
        ? "Something went wrong. Please try again."
        : "Check your email for a reset link.",
    );
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

      {!showForgotPassword ? (
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="block w-full text-center text-sm text-ink/60 hover:text-coral transition-colors mt-4"
        >
          Forgot password?
        </button>
      ) : (
        <form onSubmit={handleResetPassword} className="mt-6 space-y-3">
          <input
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="Your email"
            required
            className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral/50"
          />
          <button
            type="submit"
            disabled={resetSending}
            className="w-full bg-ink/10 text-ink px-8 py-2.5 rounded-full font-medium hover:bg-ink/20 transition-colors disabled:opacity-60"
          >
            {resetSending ? "Sending..." : "Send Reset Link"}
          </button>
          {resetMessage && (
            <p className="text-sm text-center text-ink/70">{resetMessage}</p>
          )}
        </form>
      )}
    </div>
  );
}
