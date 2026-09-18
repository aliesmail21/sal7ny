import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <Heart size={22} fill="currentColor" />
        LovePage
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/create">Create LovePage</Link>
      </div>
    </nav>
  );
}

export default Navbar;
