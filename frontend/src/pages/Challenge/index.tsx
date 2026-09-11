import { useParams } from "react-router-dom";
import "./index.css";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import type { Database } from "../../../../supabase/types";
import supabase from "../../lib/supabase";
import { STATUS_COLOR } from "../../lib/constants";
import ChatBubble from "./ChatBubble";
import { Send } from "lucide-react";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];
type Facility = Database["public"]["Tables"]["facilities"]["Row"];

type ChallengeDetails = {
  challenge: Challenge;
  opponent: Profile;
  messages: Message[]; // Assumes that a challenge always has atleast one message
  facility: Facility;
};

function Challenge() {
  const { challengeId } = useParams();
  const { session } = useAuthContext();
  const userId = session?.user?.id;

  const [challengeDetails, setChallengeDetails] =
    useState<ChallengeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadChallengeDetails() {
    if (!userId || !challengeId) {
      setChallengeDetails(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("challenges")
      .select(
        `*,
      sender:profiles!sender_user_id(*),
      receiver:profiles!receiver_user_id(*),
      messages(*),
      facility:facilities!facility_id(*)`,
      )
      .eq("id", challengeId)
      .order("sent_at", { referencedTable: "messages", ascending: true })
      .maybeSingle();

    if (error) {
      console.error("Error fetching challenges: ", error);
      setLoading(false);
      return;
    }

    if (!data) {
      setChallengeDetails(null);
      setLoading(false);
      return;
    }

    const { sender, receiver, messages, facility, ...challenge } = data;
    setChallengeDetails({
      challenge: challenge,
      opponent: challenge.sender_user_id === userId ? receiver : sender,
      messages: messages,
      facility: facility,
    });
    setLoading(false);
  }

  useEffect(() => {
    loadChallengeDetails();
  }, [userId, challengeId]);

  if (loading) return <p>Loading messages...</p>;
  if (!challengeDetails) return <p>Failed to load challenge</p>;

  return (
    <div className="challenge-page">
      <div className="card">
        <div className="header">
          {/* Opponent information */}
          <div className="opponent">
            <span className="name  gb-ellipsis">
              {challengeDetails.opponent.first_name}{" "}
              {challengeDetails.opponent.last_name}
            </span>
            <div className="rating">
              <span className="rating-label">Rating </span>
              <span className="rating-value gb-rating-pill">
                {challengeDetails.opponent.rating}
              </span>
            </div>
          </div>
          {/* Status display */}
          <div
            className={
              "status gb-" +
              (STATUS_COLOR[challengeDetails.challenge.status] ?? "gray") +
              "-pill"
            }
          >
            {challengeDetails.challenge.status.charAt(0).toUpperCase() +
              challengeDetails.challenge.status.slice(1)}
          </div>
          {/* Challenge information */}
          <div className="meta">
            <div className="meta-item">
              <span className="meta-label">Facility</span>
              <span className="meta-value">
                {challengeDetails.facility.name}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Address</span>
              <span className="meta-value">
                {challengeDetails.facility.address}
              </span>
            </div>
          </div>
          {/* Buttons */}
        </div>
        {/* Chat */}
        <div className="chat">
          {challengeDetails.messages.map((message) => (
            <ChatBubble
              key={message.id}
              content={message.content}
              sentAt={message.sent_at}
              mine={message.sender_user_id === userId}
            />
          ))}
        </div>
        {/* input  */}
        <div className="chat-input gb-input-group">
          <textarea className="text-area" rows={1} />
          <button className="send-btn gb-green-btn">
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Challenge;
