import { Link } from "react-router-dom";
import "./Navbar.css";
import { House, MessageSquareText, User } from "lucide-react";
import { useAuthContext } from "../contexts/AuthContext";

function Navbar() {
  const { session } = useAuthContext();

  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        <svg
          className="wordmark"
          width="220"
          height="50"
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
        {session && (
          <ul className="logged-in-ul">
            <li>
              <Link to="/">
                <House className="icon" />
              </Link>
            </li>
            <li>
              <Link to="/challenges">
                <MessageSquareText className="icon" />
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <User className="icon" />
              </Link>
            </li>
          </ul>
        )}
        {!session && (
          <ul className="logged-out-ul">
            <li>
              <Link className="green-btn" to="/register">
                Register
              </Link>
            </li>
            <li>
              <Link className="gray-btn" to="/login">
                Log in
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
