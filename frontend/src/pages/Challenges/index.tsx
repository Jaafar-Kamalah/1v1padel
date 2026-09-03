import { Link } from "react-router-dom";
import "./index.css";

function Challenges() {
  return (
    <div className="challenges-page">
      <div className="card">
        <h1>All Challenges</h1>
        <ul className="list">
          <li className="row">
            <Link className="link" to="/">
              <span>Jaafar Kamalah</span>
            </Link>
          </li>
          <li className="row">
            <Link className="link" to="/">
              <span>Hassan Ali</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Challenges;
