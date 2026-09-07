import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-24">
      <h1 className="text-2xl font-display font-medium text-ink mb-b text-center">
        Set a New Password
      </h1>
      {success ? (
        <p className="text-center text-sage-700">
          Password updated! Redirecting to login...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            required
            className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:rinh-coral/50"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new Ppssword"
            required
            className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:rinh-coral/50"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-coral text-white px-8 py-3 rounded-full font-medium hover:bg-clay transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : "Update Password"}
          </button>
          {error && <p className="text-clay text-sm text-center">{error}</p>}
        </form>
      )}
    </div>
  );
}
