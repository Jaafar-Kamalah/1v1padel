import { Info } from "lucide-react";
import "./ChatBubble.css";

interface Props {
  content: string;
  sentAt: string;
  isMine: boolean;
  isStatusMessage: boolean;
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

function ChatBubble({ content, sentAt, isMine, isStatusMessage }: Props) {
  return (
    <div className="chat-bubble">
      <div
        className={
          isStatusMessage ? "status-message" : isMine ? "mine" : "theirs"
        }
      >
        <div className="content">
          {isStatusMessage && <Info className="info-icon" />}
          <span className="content-text">{content}</span>
        </div>
        <div className="sent-at">{formatTime(sentAt)}</div>
      </div>
    </div>
  );
}

export default ChatBubble;
