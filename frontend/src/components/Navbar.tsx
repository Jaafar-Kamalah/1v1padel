import { Link } from "react-router-dom";
import "./Navbar.css"
import { House } from "lucide-react";

function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        <svg
          className="wordmark"
          width="180"
          height="40"
          viewBox="0 0 140 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text x="0" y="22" fontSize="18" fontWeight="700" fill="#ffffff">
            1v1
            <tspan fill="rgb(169, 236, 102)">Padel</tspan>
          </text>
        </svg>
      </Link>

      <div className="nav-links">
        <ul>
          <li>
            <Link to="/">Facilities</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/challenges">Challenges</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
