import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      {savedPosts.map((post) => (
        <div
          key={post._id}
          className="flex flex-col bg-black-200 rounded-xl w-[300px] h-[400px] text-white px-6 py-8 cursor-pointer"
        >
          <Link
            to={`/post/${post._id}`}
            className="flex flex-col justify-between h-full"
          >
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full w-[25px] h-[25px] flex justify-center items-center">
                <i className="fa-solid fa-user text-black"></i>
              </div>
              <p>{post.author.name}</p>
            </div>
            <h2 className="font-bold text-lg">{post.title}</h2>
            <div className="flex flex-col items-center gap-2">
              <div className="w-full">
                <p className="opacity-80 text-sm">{post.date}</p>
              </div>
              <div className="flex items-center justify-center">
                <img
                  className="w-[310px] h-[180px] object-cover rounded-md"
                  src={post.img}
                  alt={post.title}
                />
              </div>
            </div>
          </Link>
          <div className="flex justify-between mt-4">
            <div className="flex gap-2 justify-center items-center">
              <button>
                <i className="fa-solid fa-arrow-up"></i>
              </button>
              <p>{post.upvotes}</p>
            </div>
            <button onClick={() => handleSavePost(post)}>
              <i className="fa-solid fa-bookmark"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavePost;
