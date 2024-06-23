// ProtectedRoute.jsx
import { useNavigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  
  if (!isLoggedIn) {
    return navigate("/login");
  }

  return <Outlet />;
};

export default ProtectedRoute;
