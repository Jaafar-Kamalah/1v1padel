import { Link } from "react-router-dom";
import type { Database } from "../../../../supabase/types";
import "./ChallengeRow.css";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface Props {
  challenge: Challenge;
  opponent: Profile;
}

function ChallengeRow({ challenge, opponent }: Props) {
  return (
    <li className="challenge-row">
      <Link className="link" to="/">
        <span>{opponent.first_name + " " + opponent.last_name}</span>
        <span>{challenge.status}</span>
      </Link>
    </li>
  );
}

export default ChallengeRow;
