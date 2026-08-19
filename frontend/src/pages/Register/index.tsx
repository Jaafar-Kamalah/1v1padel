import "./index.css";
import supabase from "../../lib/supabase";
import { useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      alert("Success");
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
          <button type="submit">Continue</button>
        </form>
      </div>
    </>
  );
}

export default Register;
