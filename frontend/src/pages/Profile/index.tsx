import { useEffect, useState } from "react";
import "./index.css";
import { useAuthContext } from "../../contexts/AuthContext";
import supabase from "../../lib/supabase";
import type { Database } from "../../../../supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

function Profile() {
  const { session } = useAuthContext();
  const userId = session?.user?.id;
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!userId) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile: ", error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    }

    loadProfile();
  }, [userId]);

  async function logout() {
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error during logout : " + error.message);
      console.error("Error during logout : " + error.message);
    }
    setLoggingOut(false);
  }

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="card">
        <h1>Profile</h1>
        <p>Email: {session?.user.email}</p>
        <button className="gb-red-btn" disabled={loggingOut} onClick={logout}>
          {loggingOut ? "Logging out..." : "Log Out"}
        </button>
      </div>
    </div>
  );
}

export default Profile;
