import { useState, useEffect } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import SavePost from "./pages/SavePost";
import EditPost from "./pages/EditPost";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("https://devflow-srjs.onrender.com/checkAuthStatus", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("https://devflow-srjs.onrender.com/logout", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <main className="h-screen bg-black-100">
      <header className="w-full flex justify-between items-center text-white sm:px-8 px-4 py-4 border-b border-b-black-300">
        <Link to="/">
          <p className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Dev<span className="text-red-600">Flow</span></p>
        </Link>
        <div className="flex gap-2">
          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="font-medium bg-black-200 text-white px-4 py-4 w-[40px] h-[40px] flex justify-center items-center rounded-full"
              >
                <i className="fa-solid fa-user-plus"></i>
              </Link>
            </>
          )}
          <Link
            to="/post"
            className="font-medium bg-black-300 text-white px-2 py-2 w-[40px] h-[40px] flex justify-center items-center rounded-full"
          >
            <i className="fa-solid fa-plus"></i>
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/savePost">
                <button className="font-medium text-white px-4 py-2 rounded-md">
                  <i className="fa-regular fa-bookmark"></i>
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="font-medium text-white px-4 py-2 rounded-md"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
              </button>
            </>
          )}
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/register"
          element={<SignUp handleLogin={handleLogin} />}
        />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          <Route path="/post" element={<CreatePost />} />
          <Route path="/post/:id/edit" element={<EditPost />} />
          <Route path="/savePost" element={<SavePost />} />
          <Route path="/post/:id" element={<PostDetails />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
