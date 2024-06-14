import { Link } from "react-router-dom";

const Card = ({ post, handleSavePost }) => {
  return (
    <>
      <Link
        to={`/post/${post._id}`}
        className="flex flex-col justify-between h-full"
      >
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-full w-[20px] h-[20px] text-[10px] flex justify-center items-center">
            <i className="fa-solid fa-user text-black"></i>
          </div>
          <p className="text-[14px]">{post.author.name}</p>
        </div>
        <h2 className="font-bold text-lg">{post.title}</h2>
        <div className="flex flex-col items-center gap-2">
          <div className="w-full">
            <p className="opacity-80 text-[11px]">{post.date}</p>
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
            <i className="fa-solid fa-circle-up"></i>
          </button>
          <p>{post.upvotes}</p>
        </div>
        <button onClick={() => handleSavePost(post)}>
          <i className="fa-solid fa-bookmark"></i>
        </button>
      </div>
    </>
  );
};

export default Card;
