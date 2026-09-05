import "./index.css";
import { useEffect, useState } from "react";
import type { Database } from "../../../../supabase/types";
import ChallengeRow from "./ChallengeRow";
import { useAuthContext } from "../../contexts/AuthContext";
import supabase from "../../lib/supabase";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type ChallengeWithOpponent = {
  challenge: Challenge;
  opponent: Profile;
};

function Challenges() {
  const { session } = useAuthContext();
  const userId = session?.user?.id;

  const [challengesWithOpponent, setChallengesWithOpponent] = useState<ChallengeWithOpponent[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadChallengesWithOpponent() {
    if (!userId) {
      setChallengesWithOpponent([]);
      setLoading(false);
      return;
    }

    // Get all user challenges and all involved user profiles
    const { data, error } = await supabase
      .from("challenges")
      .select(
        `*,
      sender:profiles!sender_user_id(*),
      receiver:profiles!receiver_user_id(*)`,
      )
      .or(`sender_user_id.eq.${userId}, receiver_user_id.eq.${userId}`);

    if (error) {
      console.error("Error fetching challenges: ", error);
    } else {
      const formattedData = data.map(({ sender, receiver, ...challenge }) => ({
        challenge: challenge,
        opponent: challenge.sender_user_id === userId ? receiver : sender,
      }));
      setChallengesWithOpponent(formattedData);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadChallengesWithOpponent();
  }, [userId]);

  if (loading) return <p>Loading challenges...</p>;

  return (
    <div className="challenges-page">
      <div className="card">
        <h1>All Challenges</h1>

        {challengesWithOpponent.length === 0 ? (
          <p className="challenges-empty">No challenges yet.</p>
        ) : (
          <ul className="list">
            {challengesWithOpponent.map((cwo) => (
              <ChallengeRow key={cwo.challenge.id} challenge={cwo.challenge} opponent={cwo.opponent} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Challenges;
