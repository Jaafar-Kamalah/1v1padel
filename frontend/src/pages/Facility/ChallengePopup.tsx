import { useState } from "react";
import "./ChallengePopup.css";
import { useAuthContext } from "../../contexts/AuthContext";
import supabase from "../../lib/supabase";
import type { Database } from "../../../../supabase/types";

type LeaderboardEntry =
  Database["public"]["Views"]["facility_leaderboard"]["Row"];

interface Props {
  onClose: () => void;
  challenged: LeaderboardEntry;
}

function ChallengePopup({ onClose, challenged }: Props) {
  const { user_id: challengedUserId, facility_id: facilityId } = challenged;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { session } = useAuthContext();
  const userId = session?.user?.id;

  async function onSend(message: string) {
    if (!userId || loading) return;

    setLoading(true);
    const { data: challengeData, error: challengeError } = await supabase
      .from("challenges")
      .insert({
        facility_id: facilityId,
        sender_user_id: userId,
        receiver_user_id: challengedUserId,
        status: "pending",
      })
      .select("id")
      .single();

    if (challengeError) {
      console.error("Error sending challenge: ", challengeError);
      setLoading(false);
      return;
    }
    const { error: messageError } = await supabase.from("messages").insert({
      challenge_id: challengeData?.id,
      content: message,
      sender_user_id: userId,
    });

    if (challengeError) {
      console.error("Error sending message: ", messageError);
      return;
    }
    onClose();
  }

  return (
    <div className="challenge-backdrop" onClick={onClose}>
      <div className="challenge-card" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>
          X
        </button>
        <h2>Challenge Message</h2>
        <textarea
          className="modal-textarea"
          placeholder="Say hi, and let them know when you're free to play..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
        <button
          className="modal-send-btn green-btn"
          onClick={() => onSend(message)}
          disabled={loading || message.trim() === ""}
        >
          {loading ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChallengePopup;
