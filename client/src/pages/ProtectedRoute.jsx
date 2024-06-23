// ProtectedRoute.jsx

import { useEffect, useState } from "react";
import { useNavigate, Outlet} from "react-router-dom";

const ProtectedRoute = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("https://devflow-3g17.onrender.com/user", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          console.log("Authorization successful");
          setAuthenticated(true);
        } else {
          console.log("Not Authorized");
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (!authenticated) {
    return navigate("/login");
  }

  return <Outlet />;
};

export default ProtectedRoute;
