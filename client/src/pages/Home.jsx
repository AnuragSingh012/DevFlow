import { useEffect, useState } from "react";
import Card from "../components/Card";
import { CircularProgress } from "@mui/material";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://devflow-3g17.onrender.com/post", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const posts = await response.json();
          setPosts(posts);
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSavePost = async (post) => {
    try {
      const response = await fetch("https://devflow-3g17.onrender.com/user/savePost", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: post._id }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center mt-4 relative">
        <div className="flex justify-center items-center mt-4 relative w-[80%]">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black-200 rounded-md text-white px-2 py-2 pl-10 w-full"
            placeholder="Search post here..."
            type="text"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-screen bg-black-100">
          <CircularProgress size={24} />
        </div>
      ) : (
        <div className="flex w-full bg-black-100 flex-wrap gap-6 justify-center sm:px-2 px-6 lg:px-2 py-14">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="flex flex-col bg-black-200 rounded-xl w-[300px] h-[400px] text-white px-4 py-4 cursor-pointer"
            >
              <Card handleSavePost={handleSavePost} post={post} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Home;
