import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthProvider } from "../context/AuthProvider";

// Wraps every /admin page. Login state (and the Supabase auth code) is only
// loaded here, so public pages don't download it.
export default function AdminShell() {
  return (
    <AuthProvider>
      <Helmet>
        <title>Admin | Art by Claudia</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Outlet />
    </AuthProvider>
  );
}
