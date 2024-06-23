// ProtectedRoute.jsx

import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/user", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          console.log("Authorization successful");
          setAuthenticated(true);
        } else {
          console.log("Not Authorized");
          setAuthenticated(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setAuthenticated(false);
        navigate("/login");
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return navigate("/login");
  }

  return <Outlet />;
};

export default ProtectedRoute;
