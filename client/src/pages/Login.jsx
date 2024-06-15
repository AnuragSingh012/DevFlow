import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import FormField from "../components/FormField";

const Login = ({ handleLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create login object
    const user = {
      username: formData.username,
      password: formData.password,
    };

    try {
      const response = await fetch("https://devflow-srjs.onrender.com/login", {
        // Use port 5000 to match your backend
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
      });

      if (response.ok) {
        // Handle successful post creation
        handleLogin();
        navigate(from); // Redirect to the intended route
      } else {
        // Handle errors
        console.error("Error user login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-white w-full p-8 sm:px-[50px] sm:py-[20px] md:px-[100px] md:py-[40px] lg:px-[500px] lg:py-[40px] flex justify-center items-center">
        <form className="w-full" onSubmit={handleSubmit}>
          <FormField
            labelName="Username"
            type="text"
            name="username"
            placeholder="Enter UserName"
            value={formData.username}
            handleChange={handleChange}
            className="px-2 py-2 rounded-sm bg-black-200 text-white"
          />
          <FormField
            labelName="Password"
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            handleChange={handleChange}
            className="px-2 py-2 rounded-sm bg-black-200 text-white"
          />
          <button
            className="w-full mt-6 py-2 rounded-md bg-white text-black-100"
            type="submit"
          >
            Continue
          </button>
        </form>
      </div>
      <div>
        <p className="text-white">
          Don't have an account?
          <Link to="/register">
            <span className="text-blue-500 font-semibold px-2">Sign up</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
