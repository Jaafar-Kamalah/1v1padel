import "./index.css";
import { useEffect, useState } from "react";
import type { Database } from "../../../../supabase/types";
import ChallengeRow from "./ChallengeRow";
import { useAuthContext } from "../../contexts/AuthContext";
import supabase from "../../lib/supabase";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];

function Challenges() {
  const { session } = useAuthContext();
  const userId = session?.user?.id;

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadChallenges() {
    if (!userId) {
      setChallenges([]);
      setLoading(false);
      return;
    }
    
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .or(`sender_user_id.eq.${userId}, receiver_user_id.eq.${userId}`);

    if (error) {
      console.error("Error fetching challenges: ", error);
    } else {
      setChallenges(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadChallenges();
  }, [userId]);

  if (loading)
    return <p>Loading challenges...</p>; 

  return (
    <div className="challenges-page">
      <div className="card">
        <h1>All Challenges</h1>

        {challenges.length === 0 ? (
          <p className="challenges-empty">No challenges yet.</p>
        ) : (
          <ul className="list">
            {challenges.map((c) => (
              <ChallengeRow key={c.id} challenge={c} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Challenges;
