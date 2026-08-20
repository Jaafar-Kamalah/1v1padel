import "./index.css";
import supabase from "../../lib/supabase";
import { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, seterror] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        alert("Supabase error: " + error);
        console.error("Supabase error: " + error);
      } else {
        alert("Registration succeeded!");
        navigate("/");
      }
    } catch (err) {
      alert("Unexpected error: " + err);
      console.error("Unexpected error: " + err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <h1>Enter Your Email and a Password</h1>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading}>
            Continue
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
