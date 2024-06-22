// ProtectedRoute.jsx

import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("https://devflow-srjs.onrender.com/user", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          console.log("Auth done");
          setAuthenticated(true);
        } else {
          console.log("Error in Auth");
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner
  }

  if (!authenticated) {
    return navigate("/login");
  }

  return <Outlet />;
};

export default ProtectedRoute;
