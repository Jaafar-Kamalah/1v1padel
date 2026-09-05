import "./index.css";
import { useEffect, useState } from "react";
import type { Database } from "../../../../supabase/types";
import ChallengeRow from "./ChallengeRow";
import { useAuthContext } from "../../contexts/AuthContext";
import supabase from "../../lib/supabase";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type ChallengeSummary = {
  challenge: Challenge;
  opponent: Profile;
};

function Challenges() {
  const { session } = useAuthContext();
  const userId = session?.user?.id;

  const [challengeSummaries, setChallengeSummaries] = useState<ChallengeSummary[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadChallengeSummaries() {
    if (!userId) {
      setChallengeSummaries([]);
      setLoading(false);
      return;
    }

    // Get all user challenges, involved user profiles and last message
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
      setChallengeSummaries(formattedData);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadChallengeSummaries();
  }, [userId]);

  if (loading) return <p>Loading challenges...</p>;

  return (
    <div className="challenges-page">
      <div className="card">
        <h1>All Challenges</h1>

        {challengeSummaries.length === 0 ? (
          <p className="challenges-empty">No challenges yet.</p>
        ) : (
          <ul className="list">
            {challengeSummaries.map((cs) => (
              <ChallengeRow key={cs.challenge.id} challenge={cs.challenge} opponent={cs.opponent} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Challenges;
