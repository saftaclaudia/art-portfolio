import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-sm mx-auto px-4 py-24 text-center text-ink/60">
        Loading...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
