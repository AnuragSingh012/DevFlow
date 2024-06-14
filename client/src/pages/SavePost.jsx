import { useEffect, useState } from "react";
import Card from "../components/Card";

const SavePost = () => {
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/savePost", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Success:", data);
        setSavedPosts(data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchSavedPosts();
  }, [savedPosts]);

  const handleSavePost = async (post) => {
    try {
      const response = await fetch("http://localhost:3000/savePost", {
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
    <div className="flex w-full bg-black-100 flex-wrap gap-6 justify-center sm:px-2 px-6 lg:px-2 py-14">
      {savedPosts.length > 0 ? (
        savedPosts.map((post) => (
          <div
            key={post._id}
            className="flex flex-col bg-black-200 rounded-xl w-[300px] h-[400px] text-white px-4 py-4 cursor-pointer"
          >
            <Card handleSavePost={handleSavePost} post={post} />
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center gap-4">
          <div>
            <i className="fa-solid fa-circle-xmark text-red-600 text-7xl"></i>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-lg font-bold">No Saved posts yet</h1>
            <p className="text-white text-sm opacity-80">
              your saved posts will appear here and you can access anytime
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavePost;
