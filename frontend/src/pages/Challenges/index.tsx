import { Link } from "react-router-dom";
import "./index.css";
import { useState } from "react";
import type { Database } from "../../../../supabase/types";
import ChallengeRow from "./ChallengeRow";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];

function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  return (
    <div className="challenges-page">
      <div className="card">
        <h1>All Challenges</h1>

        {challenges.length === 0 ? (
          <p className="challenges-empty">No challenges yet.</p>
        ) : (
          <ul className="list">
            {challenges.map((c) => (
              <ChallengeRow challenge={c}/>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Challenges;
