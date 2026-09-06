// TODO
// *Use navlink to have active prop
// *Make icons brighter if on active page
// *Show only Login link when on register page and vice versa
// *Add rating in middle of navbar and hide it if there is no room?


import { Link } from "react-router-dom";
import "./Navbar.css";
import { House, MessageSquareText, User } from "lucide-react";
import { useAuthContext } from "../contexts/AuthContext";

function Navbar() {
  const { session } = useAuthContext();

  return (
    <nav className="nav">
      <Link to="/" className="site-title" aria-label="Facilities">
        <svg
          className="wordmark"
          width="220"
          height="50"
          viewBox="0 0 140 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text x="0" y="22" fontSize="18" fontWeight="700" fill="#ffffff">
            1v1
            <tspan className="padel">Padel</tspan>
          </text>
        </svg>
      </Link>
      <div className="nav-links">
        {session ? (
          <ul className="logged-in-ul">
            <li>
              <Link to="/" aria-label="Facilities">
                <House className="icon" />
              </Link>
            </li>
            <li>
              <Link to="/challenges" aria-label="Challenges">
                <MessageSquareText className="icon" />
              </Link>
            </li>
            <li>
              <Link to="/profile" aria-label="Profile">
                <User className="icon" />
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="logged-out-ul">
            <li>
              <Link className="gb-green-btn" to="/register" aria-label="Register">
                Register
              </Link>
            </li>
            <li>
              <Link className="gb-gray-btn" to="/login" aria-label="Login">
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
