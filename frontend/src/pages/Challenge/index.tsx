import { useParams } from "react-router-dom";
import "./index.css";

function Challenge() {
  const { challengeId } = useParams();

  return (
    <div className="challenge-page">
      <div className="card">
        <p>Challenge {challengeId}</p>
      </div>
    </div>
  );
}

export default Challenge;
