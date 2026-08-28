import { Link } from "react-router-dom";
import "./Navbar.css"
import { House } from "lucide-react";

function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        1v1Padel
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
