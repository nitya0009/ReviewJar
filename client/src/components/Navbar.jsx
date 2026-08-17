import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-white px-6 py-4 flex justify-between items-center shadow">
      <Link to="/" className="text-xl font-bold">
       ReviewJar
      </Link>
      <div className="flex gap-4 items-center text-sm">
        {userInfo && (
          <Link to="/wishlist" className="hover:underline">
            ♥ Wishlist
          </Link>
        )}
        {userInfo?.role === "admin" && (
          <Link to="/admin" className="hover:underline">
            Admin
          </Link>
        )}
        {userInfo ? (
          <>
            <Link to="/profile" className="hover:underline">
              Hi, {userInfo.name}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-primary px-3 py-1 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
