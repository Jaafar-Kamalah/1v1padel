import type { Database } from "../../../../supabase/types";

interface Props {
  content: string;
  sentAt: string;
  mine: boolean;
}

function formatTime(pastDate: string): string {
  const sentAt = new Date(pastDate);
  const now = new Date();

  const isToday =
    sentAt.getFullYear() === now.getFullYear() &&
    sentAt.getMonth() === now.getMonth() &&
    sentAt.getDate() === now.getDate();

  return isToday
    ? sentAt.toLocaleString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : sentAt.toLocaleString(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

function ChatBubble({ content, sentAt, mine }: Props) {
  return (
    <div className={"chat-bubble " + (mine ? "mine" : "theirs")}>
      <div className="content">{content}</div>
      <div className="time">{formatTime(sentAt)}</div>
    </div>
  );
}

export default ChatBubble;
