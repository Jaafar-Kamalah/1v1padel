import { useState } from "react";
import "./index.css"
import { useAuthContext } from "../../contexts/AuthContext";
import supabase from "../../lib/supabase";

function Profile() {
  const [loggingOut, setLoggingOut] = useState(false);
  
  async function logout() {
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error during logout : " + error.message);
      console.error("Error during logout : " + error.message);
    }
    setLoggingOut(false);
  }

  const {session} = useAuthContext();

  return (
    <>
      <div className="card">
        <h1>Profile</h1>
        <p>Email: {session?.user.email}</p>
        <button disabled={loggingOut} onClick={logout}>
          {loggingOut ? "Logging out..." : "Log Out"}
        </button>
      </div>
    </>
  );
}

export default Profile;
