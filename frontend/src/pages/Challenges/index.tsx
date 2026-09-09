import "./index.css";
import { useEffect, useState } from "react";
import type { Database } from "../../../../supabase/types";
import ChallengeRow from "./ChallengeRow";
import { useAuthContext } from "../../contexts/AuthContext";
import supabase from "../../lib/supabase";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];

type ChallengeSummary = {
  challenge: Challenge;
  opponent: Profile;
  lastMessage: Message; // Assumes that a challenge always has atleast one message
  facilityName: string;
};

function Challenges() {
  const { session } = useAuthContext();
  const userId = session?.user?.id;

  const [challengeSummaries, setChallengeSummaries] = useState<
    ChallengeSummary[]
  >([]);
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
      receiver:profiles!receiver_user_id(*),
      messages(*),
      facility:facilities(name)`,
      )
      .or(`sender_user_id.eq.${userId}, receiver_user_id.eq.${userId}`)
      .order("sent_at", { referencedTable: "messages", ascending: false })
      .limit(1, { referencedTable: "messages" });

    if (error) {
      console.error("Error fetching challenges: ", error);
      setLoading(false);
      return;
    } else {
      const formattedData = data
        .map(({ sender, receiver, messages, facility, ...challenge }) => ({
          challenge: challenge,
          opponent: challenge.sender_user_id === userId ? receiver : sender,
          lastMessage: messages[0],
          facilityName: facility.name,
        }))
        .sort((cs1, cs2) => {
          // Sort challenges so that the challenge with the latest message is first
          return (
            new Date(cs2.lastMessage.sent_at).getTime() -
            new Date(cs1.lastMessage.sent_at).getTime()
          );
        });
      setChallengeSummaries(formattedData);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadChallengeSummaries();
  }, [userId]);

  // Live update on challenge insert, delete and update
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("challenges-challenges")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "challenges",
          filter: `sender_user_id=eq.${userId}`,
        },
        () => {
          loadChallengeSummaries();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "challenges",
          filter: `receiver_user_id=eq.${userId}`,
        },
        () => {
          loadChallengeSummaries();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Live update on message insert
  const challengeIds = challengeSummaries.map((cs) => cs.challenge.id).sort();
  const challengeIdsString = challengeIds.join(",");

  useEffect(() => {
    if (!userId || challengeIdsString === "") return;

    const channel = supabase
      .channel("challenges-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `challenge_id=in.(${challengeIdsString})`,
        },
        () => {
          // TODO: Instead of loadChallengeSummaries() only fetch and update the affected challenge
          loadChallengeSummaries();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, challengeIdsString]);

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
              <ChallengeRow
                key={cs.challenge.id}
                challenge={cs.challenge}
                opponent={cs.opponent}
                lastMessage={cs.lastMessage}
                facilityName={cs.facilityName}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Challenges;
