import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [upvoteState, setUpvoteState] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/post/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const post = await response.json();
          console.log(post);
          setPost(post);
        } else {
          console.error("Error fetching post");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/post/${id}/comments`,
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

    fetchPost();
    fetchComments();
  }, [id]);

  const handleUpvote = async () => {
    try {
      const response = await fetch(`http://localhost:3000/post/${id}/upvote`, {
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

    const newComment = { text, post_id: id };
    try {
      const response = await fetch(`http://localhost:3000/post/comment`, {
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

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post-details bg-black-100 text-white w-full p-8 sm:px-[50px] sm:py-[20px] md:px-[100px] md:py-[40px] lg:px-[100px] lg:py-[50px] gap-10 flex flex-col md:flex-row justify-between">
      <img
        className="w-full md:w-[40%] h-[20rem] md:h-[35rem] object-cover mb-4 md:mb-0"
        src={post.img}
        alt=""
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
        <div>
          <p>
            by <span className="text-[#6469ff]">{post.author.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 ">
          <button
            className={`text-xl ${
              upvoteState ? "text-green-500" : "text-white"
            }`}
            onClick={handleUpvote}
          >
            <i className="fa-solid fa-up-long"></i>
          </button>
          <span className="text-2xl">{post.upvotes}</span>
        </div>
        <div>
          <p className="opacity-80">{post.date}</p>
          <p className="py-2 md:py-4 text-sm h-[42%] my-2">
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
