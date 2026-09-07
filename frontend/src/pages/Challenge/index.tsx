import { useParams } from "react-router-dom";

function Challenge() {
  const { challengeId } = useParams();

  return <p>Challenge {challengeId}</p>;
}

export default Challenge;
