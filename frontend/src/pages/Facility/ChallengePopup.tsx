import type { ReactNode } from "react";
import "./ChallengePopup.css";

interface Props {
  onClose: () => void;
}

function ChallengePopup({ onClose }: Props) {
  return (
    <div className="challenge-backdrop" onClick={onClose}>
      <div className="challenge-card">
        <button className="close" onClick={onClose}>X</button>
        <h2>Challenge Message</h2>
      </div>
    </div>
  );
}

export default ChallengePopup;
