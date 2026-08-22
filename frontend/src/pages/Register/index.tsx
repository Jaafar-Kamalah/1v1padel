import "./index.css";
import supabase from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [startingRating, setStartingRating] = useState<number | null>(null);

  const [ratings, setRatings] = useState<any[]>([]); // TODO: change to type initial_rating after basic facility discovery merge
  //const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("initial_ratings")
      .select("*")
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setRatings(data ?? []);
      });
  }, []);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create user
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });
      if (error) {
        alert("Supabase error: " + error.message);
        console.error("Supabase error: " + error.message);
        return;
      }
      // 2. Create profile
      const userId = data.user?.id; // If email verification is enabled in future this will return null
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          rating: startingRating,
        });

      if (profileError) {
        alert("Profile creation error: " + profileError.message);
        console.error(profileError.message);
        // TODO: remove user if profile creation failed for consistency
        // A user without a profile can't however cause damage so not a security risk atm
        return;
      }
      alert("Registration succeeded!");
      navigate("/");
    } catch (err) {
      alert("Unexpected error: " + err);
      console.error("Unexpected error: " + err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <h1>Register an Account</h1>
          <div className="input-group">
            <input
              type="text"
              placeholder="First name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Last name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <select
              required
              value={startingRating ?? ""}
              onChange={(e) => setStartingRating(Number(e.target.value))}
            >
              <option value="">Select starting rating</option>
              {ratings.map((r) => (
                <option key={r.rating} value={r.rating}>
                  {r.rating}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
