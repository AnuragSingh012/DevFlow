import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = ({ handleLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create user object
    const user = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch("https://devflow-3g17.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        handleLogin(data);
        navigate(-2); // Redirect to the intended route
      } else {
        // Handle errors
        const errorData = await response.json();
        toast.error(errorData.message);
        console.error("Error user registration");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="text-white w-full bg-black-100 p-8 sm:px-[50px] sm:py-[20px] md:px-[100px] md:py-[40px] lg:px-[500px] lg:py-[40px] flex justify-center items-center">
      <ToastContainer />
      <form className="w-full" onSubmit={handleSubmit}>
        <FormField
          labelName="Name"
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          handleChange={handleChange}
          className="px-2 py-2 rounded-sm bg-black-200 text-white"
        />
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
          labelName="Email"
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          handleChange={handleChange}
          className="px-2 py-2 rounded-sm bg-black-200 text-white"
        />
        <FormField
          labelName="Password"
          type="password"
          name="password"
          placeholder="Create password"
          value={formData.password}
          handleChange={handleChange}
          className="px-2 py-2 rounded-sm bg-black-200 text-white"
        />
        <button
          className="w-full mt-6 py-2 rounded-md bg-white text-black"
          type="submit"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default SignUp;
