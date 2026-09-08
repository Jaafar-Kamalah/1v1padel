import { Link } from "react-router-dom";
import type { Database } from "../../../../supabase/types";
import "./ChallengeRow.css";
import { MapPin } from "lucide-react";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];

// TODO: maybe use enum in db and get status types from types.ts to make this typesafe
const STATUS_COLOR: Record<string, string> = {
  pending: "orange",
  accepted: "green",
  denied: "gray",
  completed: "gray",
};

interface Props {
  challenge: Challenge;
  opponent: Profile;
  lastMessage: Message;
  facilitName: string;
}

function formatTimeAgo(pastDate: string): string {
  const past = new Date(pastDate);
  const now = new Date();

  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return diffMins.toString() + "m ago";
  if (diffHours < 24) return diffHours.toString() + "h ago";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return diffDays.toString() + "d ago";

  return past.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function ChallengeRow({
  challenge,
  opponent,
  lastMessage,
  facilitName,
}: Props) {
  return (
    <li className="challenge-row">
      <Link className="link" to={"/challenges/" + challenge.id}>
        {/* TODO: Add avatar/image to tell apart users with same name */}

        <div className="line-1">
          {" "}
          <div className="opponent">
            <span className="name gb-ellipsis">
              {opponent.first_name + " " + opponent.last_name}
            </span>
            <span className="rating gb-rating-pill">{opponent.rating}</span>
          </div>
          <span className="date">{formatTimeAgo(lastMessage.sent_at)}</span>
        </div>
        <div className="location gb-ellipsis">
          <MapPin className="map-pin" />
          <span>{facilitName}</span>
        </div>
        <div className="line-2">
          <span className="last-message gb-ellipsis">
            {lastMessage.content}
          </span>
          <span
            className={"status gb-" + STATUS_COLOR[challenge.status] + "-pill"}
          >
            {challenge.status.charAt(0).toUpperCase() +
              challenge.status.slice(1)}
          </span>
        </div>
      </Link>
    </li>
  );
}

export default ChallengeRow;
