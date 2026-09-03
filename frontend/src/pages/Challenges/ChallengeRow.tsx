import { Link } from "react-router-dom";
import type { Database } from "../../../../supabase/types";
import "./ChallengeRow.css";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];

interface Props {
    challenge : Challenge;
}

function ChallengeRow({challenge} : Props) {
  return (
    <li className="challenge-row">
      <Link className="link" to="/">
        <span>{challenge.status}</span>
      </Link>
    </li>
  );
}

export default ChallengeRow;
