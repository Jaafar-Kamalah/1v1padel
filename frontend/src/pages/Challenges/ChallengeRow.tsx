import { Link } from "react-router-dom";
import type { Database } from "../../../../supabase/types";
import "./ChallengeRow.css";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];


interface Props {
  challenge: Challenge;
  opponent: Profile;
  lastMessage: Message;
}

function ChallengeRow({ challenge, opponent, lastMessage }: Props) {
  return (
    <li className="challenge-row">
      <Link className="link" to="/">
        {/* TODO: Add avatar/image to tell apart users with same name */}

        <div className="line-1">
          {" "}
          <span className="name">
            {opponent.first_name + " " + opponent.last_name}
          </span>
          <span className="date">{challenge.sent_at}</span>
        </div>
        <div className="line-2">
          <span className="last-message">{lastMessage.content}</span>
          <span className="status">{challenge.status}</span>
        </div>
      </Link>
    </li>
  );
}

export default ChallengeRow;
