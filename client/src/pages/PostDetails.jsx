import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [upvoteState, setUpvoteState] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://devflow-3g17.onrender.com/post/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const post = await response.json();
          setPost(post);
        } else {
          console.error("Error fetching post");
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setLoading(false);
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(
          `https://devflow-3g17.onrender.com/post/comment/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const comments = await response.json();
          setComments(comments);
        } else {
          console.error("Error fetching comments");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await fetch("https://devflow-3g17.onrender.com/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const user = await response.json();
          console.log(user);
          setUserId(user._id);
        } else {
          console.error("Error fetching user data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPost();
    fetchComments();
    fetchUserData();
  }, [id]);

  const handleUpvote = async () => {
    if (!userId) {
      toast.error("Please Login to Upvote");
      return;
    }

    try {
      const response = await fetch(`https://devflow-3g17.onrender.com/post/${id}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setPost((prevPost) => ({
          ...prevPost,
          upvotes: data.upvotes,
        }));
        setUpvoteState(data.upvoteStatus);
      } else {
        console.error("Error updating upvote");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setText("");

    if (!userId) {
      toast.error("Please Login to Comment");
      return;
    }

    const newComment = { text, post_id: id };
    try {
      const response = await fetch(`https://devflow-3g17.onrender.com/post/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        const data = await response.json();
        setComments((prevComments) => [...prevComments, data]);
      } else {
        console.error("Error while sending comment");
      }
    } catch (err) {
      console.error("Error", err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://devflow-3g17.onrender.com/post/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        navigate("/"); // Redirect to the homepage or any other page after successful deletion
      } else {
        console.error("Error deleting post");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToastContainer />
      {loading ? (
        <div className="flex justify-center items-center h-screen bg-black-100">
          <CircularProgress size={24} />
        </div>
      ) : (
        <div className="post-details bg-black-100 text-white w-full p-8 sm:px-[50px] sm:py-[20px] md:px-[100px] md:py-[40px] lg:px-[100px] lg:py-[50px] gap-10 flex flex-col md:flex-row justify-between">
          <img
            className="w-full md:w-[40%] h-[20rem] md:h-[35rem] object-cover mb-4 md:mb-0"
            src={post.img}
            alt="post"
          />
          <div className="flex flex-col w-full md:w-[60%] custom-scroll h-[560px] px-2">
            <h1 className="font-bold text-2xl md:text-4xl py-2 md:py-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-2 py-2">
              {post.tags.map((tag, index) => (
                <p
                  className="bg-black-300 text-violet-200 font-semibold px-2 py-1 rounded-md text-xs"
                  key={index}
                >
                  #{tag}
                </p>
              ))}
            </div>
            <div className="mt-2">
              <p className="bg-black-200 inline px-2 py-1 rounded-lg">
                by{" "}
                <span className="font-semibold text-[#6469ff]">
                  {post.author.name}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 ">
              <button
                className={`text-xl ${
                  upvoteState ? "text-yellow-300" : "text-white"
                }`}
                onClick={handleUpvote}
              >
                <i className="fa-solid fa-circle-up"></i>
              </button>
              <span className="text-2xl">{post.upvotes}</span>
            </div>
            {post.author._id == userId && (
              <div className="flex gap-3">
                <Link to={`/post/${id}/edit`}>
                  <button className="flex justify-center items-center gap-1 text-lg bg-black-200 px-2 py-1 mt-2 mb-2 rounded-md">
                    <i className="fa-solid fa-pen-to-square"></i>Edit
                  </button>
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex justify-center items-center gap-1 text-lg bg-black-200 px-2 py-1 mt-2 mb-2 rounded-md"
                >
                  <i className="fa-solid fa-trash text-red-600"></i>Delete
                </button>
              </div>
            )}
            <div>
              <p className="opacity-80 text-[13px]">{post.date}</p>
              <p className="py-2 md:py-4 text-sm h-[42%] my-2 whitespace-pre-wrap">
                {post.description}
              </p>
            </div>
            <div>
              <form
                onSubmit={handleSubmit}
                className="w-[100%] lg:w-[60%] flex flex-col"
              >
                <div className="flex justify-center items-center gap-2">
                  <input
                    onChange={(e) => setText(e.target.value)}
                    className="bg-black-200 w-full text-white px-2 py-2 rounded-md"
                    placeholder="Add comments.."
                    type="text"
                    value={text}
                  />
                  <button className="bg-black-300 px-2 py-2 rounded-md">
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
                {comments.length > 0 ? (
                  <div className="bg-black-200 mt-4 flex flex-col h-[100%] p-4">
                    {comments.map((comment) => (
                      <div
                        className="w-[80%] bg-black-100 rounded-lg m-1 px-2 py-2"
                        key={comment._id}
                      >
                        <div className="flex gap-2 items-center">
                          <h1 className="text-[12px] opacity-80">
                            @{comment.author.name}
                          </h1>
                        </div>
                        <h2 className="text-md pl-2">{comment.text}</h2>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className=" text-center mt-4">No Comments yet</p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetails;
