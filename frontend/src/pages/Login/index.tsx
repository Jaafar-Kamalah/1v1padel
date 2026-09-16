import supabase from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css"

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });
      if (error) {
        alert("Supabase error: " + error.message);
        console.error("Supabase error: " + error.message);
        return;
      }
      navigate("/");
    } catch (err) {
      alert("Unexpected error: " + err);
      console.error("Unexpected error: " + err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="gb-input-group">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="gb-input-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="gb-green-btn" type="submit" disabled={loading}>
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
