import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }
  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
