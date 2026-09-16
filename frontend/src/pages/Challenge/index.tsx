import { useParams } from "react-router-dom";
import "./index.css";
import { useEffect, useRef, useState } from "react";
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
  const [loadingChallenge, setLoadingChallenge] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); // new
  const [message, setMessage] = useState("");

  async function loadChallengeDetails() {
    if (!userId || !challengeId) {
      setChallengeDetails(null);
      setLoadingChallenge(false);
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
      setLoadingChallenge(false);
      return;
    }

    if (!data) {
      setChallengeDetails(null);
      setLoadingChallenge(false);
      return;
    }

    const { sender, receiver, messages, facility, ...challenge } = data;
    setChallengeDetails({
      challenge: challenge,
      opponent: challenge.sender_user_id === userId ? receiver : sender,
      messages: messages,
      facility: facility,
    });
    setLoadingChallenge(false);
  }

  useEffect(() => {
    loadChallengeDetails();
  }, [userId, challengeId]);

  // Live update on new messages
  // No further channels required since challenge status changes generate new messages
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("challenge-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `challenge_id=eq.${challengeId}`,
        },
        () => {
          // TODO: just fetch the updated data instead of everything
          loadChallengeDetails();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, challengeId]);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [challengeDetails?.messages]);

  async function onSend(text: string) {
    if (!userId || isSending || !challengeId || text.trim() === "") return;
    setMessage("");
    setIsSending(true);

    const { error: messageError } = await supabase.from("messages").insert({
      challenge_id: challengeId,
      content: text,
      sender_user_id: userId,
    });

    if (messageError) {
      console.error("Error sending message: ", messageError);
      setMessage(text); // restore message if send failed
      setIsSending(false);
      return;
    }
    // TODO: Display chatmessage imediately to avoid lag by relying on real-time
    setIsSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key == "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(message);
    }
  }
  // Status buttons handling
  async function changeStatus(newStatus: string, winnerUserId?: string) {
    if (!userId || !newStatus || !challengeId) return;
    setIsUpdatingStatus(true);

    const { error } = await supabase
      .from("challenges")
      .update({ status: newStatus, winner_user_id: winnerUserId ?? null })
      .eq("id", challengeId);

    if (error) {
      console.error("Error updating challenge status: ", error);
    }

    setIsUpdatingStatus(false);
  }

  function reportWin() {
    if (!userId) return;
    changeStatus("completed", userId);
  }

  function reportLoss() {
    if (!challengeDetails?.opponent.id) return;
    changeStatus("completed", challengeDetails?.opponent.id);
  }

  function acceptChallenge() {
    changeStatus("accepted");
  }

  function denyChallenge() {
    changeStatus("denied");
  }

  if (loadingChallenge) return <p>Loading messages...</p>;
  if (!challengeDetails) return <p>Failed to load challenge</p>;

  return (
    <div className="challenge-page">
      <div className="card">
        <div className="header">
          {/* Opponent information */}
          <div className="opponent">
            <span className="name gb-ellipsis">
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
          {challengeDetails.challenge.status === "pending" &&
            userId == challengeDetails.challenge.receiver_user_id && (
              <div className="status-btns">
                <button
                  className="status-btn gb-green-btn"
                  onClick={acceptChallenge}
                  disabled={isUpdatingStatus}
                >
                  Accept Challenge
                </button>
                <button
                  className="status-btn gb-gray-btn"
                  onClick={denyChallenge}
                  disabled={isUpdatingStatus}
                >
                  Deny Challenge
                </button>
                {/* TODO */}
                {/* <button className="status-btn gb-gray-btn" onClick={changeTime}>
                  Change Time
                </button> */}
              </div>
            )}
          {challengeDetails.challenge.status === "accepted" && (
            <div className="status-btns">
              <button
                className="status-btn gb-green-btn"
                onClick={reportWin}
                disabled={isUpdatingStatus}
              >
                Report Win
              </button>
              <button
                className="status-btn gb-gray-btn"
                onClick={reportLoss}
                disabled={isUpdatingStatus}
              >
                Report Loss
              </button>
              {/* TODO */}
              {/* <button className="status-btn gb-gray-btn" onClick={reportTie}>
                We Tied
              </button> */}
            </div>
          )}
        </div>
        {/* Chat */}
        <div className="chat" ref={chatRef}>
          {challengeDetails.messages.map((message) => (
            <ChatBubble
              key={message.id}
              content={message.content}
              sentAt={message.sent_at}
              isMine={message.sender_user_id === userId}
              isStatusMessage={message.is_status_message}
            />
          ))}
        </div>
        {/* input  */}
        <div className="chat-input gb-input-group">
          <textarea
            className="text-area"
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
            onKeyDown={handleKeyDown}
          />
          <button
            className="send-btn gb-green-btn"
            onClick={() => onSend(message)}
            disabled={isSending}
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Challenge;
