import { useAuth } from "../context/useAuth";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function AdminAccountPage() {
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name || "",
  );

  const [savingName, setSavingName] = useState(false);
  const [nameMessage, setNameMesage] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSaveName = async (e) => {
    e.preventDefault();
    setSavingName(true);
    setNameMesage("");

    const { error } = await supabase.auth.updateUser({
      data: { full_name: displayName },
    });

    setSavingName(false);
    setNameMesage(error ? "Something went wrong." : " Name updated");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Password do not match.");
      return;
    }

    setSavingPassword(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordMessage("Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <Link
        to="/admin"
        className="inline-block text-sm text-ink/60 hover:text-coral transistion-colors mb-8"
      >
        &larr; Back to admin
      </Link>
      <h1 className="text-2xl font-display font-medium text-ink mb-8">
        Account Settings
      </h1>

      {/* Email (read-only) */}
      <div className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-2">Email</h2>
        <p className="text-ink bg-sand/50 rounded-xl px-4 py-3">
          {user?.email}
        </p>
      </div>

      {/* Diplay Name */}
      <form onSubmit={handleSaveName} className="mb-10">
        <h2 className="text-sm font-medium text-ink/60 mb-2">Display Name</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="flex-1 rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-coral/50"
          />
          <button
            type="submit"
            disabled={savingName}
            className="bg-ink/10 text-ink px-5 rounded-xl font-medium hover:bg-ink/20 transition-colors disabled:opacity-60"
          >
            {savingName ? "Saving" : "Save"}
          </button>
          {nameMessage && (
            <p className="text-sm text-sage-700 mt-2">{nameMessage}</p>
          )}
        </div>
      </form>

      {/* Cjhange password */}
      <form onSubmit={handleChangePassword}>
        <h2 className="text-sm font-medium text-ink/60 mb-2">
          Change Password
        </h2>
        <div className="space-y-3">
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full rounded-xl border border-blush bg-white px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-coral/50"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-coral transtion-colors"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-blush bg-white px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-coral/50"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-coral transtion-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="bg-coral text-white px-6 py-2.5 rounded-full font-medium hover:bg-clay transition-colors disabled:opacity-60"
          >
            {savingPassword ? "Saving..." : "Update Password"}
          </button>
        </div>
        {passwordError && (
          <p className="text-sm text-clay mt-2">{passwordError}</p>
        )}
        {passwordMessage && (
          <p className="text-sm text-sage-700 mt-2">{passwordMessage}</p>
        )}
      </form>
    </div>
  );
}
