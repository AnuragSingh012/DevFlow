import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormField from "../components/FormField";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    img: null,
    tags: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
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
          setFormData({
            title: post.title || "",
            description: post.description || "",
            img: null,
            tags: post.tags ? post.tags.join(", ") : "",
          });
        } else {
          console.error("Error fetching post");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const postData = new FormData();
    postData.append("title", formData.title);
    postData.append("description", formData.description);

    const tagsArray = formData.tags.split(",").map((tag) => tag.trim());
    tagsArray.forEach((tag, index) => {
      postData.append(`tags[${index}]`, tag);
    });

    if (formData.img) {
      postData.append("image", formData.img);
    }

    try {
      const response = await fetch(`https://devflow-3g17.onrender.com/post/${id}/edit`, {
        method: "PUT",
        credentials: "include",
        body: postData,
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Error updating post");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black-100 text-white w-full p-8 sm:px-[50px] sm:py-[20px] md:px-[100px] md:py-[40px] lg:px-[400px] lg:py-[40px] flex justify-center items-center">
      <div className="w-full">
        <div>
          <h1 className="font-bold text-4xl">Edit Post</h1>
        </div>
        <div>
          <form
            className="flex flex-col gap-4 mt-8"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <FormField
              labelName="Title"
              htmlFor="title"
              id="title"
              type="text"
              name="title"
              placeholder="Enter Title"
              value={formData.title}
              handleChange={handleChange}
              className="px-2 py-2 rounded-sm bg-black-200 text-white"
              disabled={loading}
            />
            <FormField
              labelName="Content"
              type="textarea"
              name="description"
              placeholder="Enter Content"
              value={formData.description}
              handleChange={handleChange}
              className="px-2 py-2 rounded-sm bg-black-200 text-white"
              disabled={loading}
            />
            <FormField
              labelName="Add Image"
              type="file"
              name="img"
              id="img"
              handleChange={handleChange}
              className="px-2 py-2 rounded-sm bg-black-200 text-white"
              disabled={loading}
            />
            <FormField
              labelName="Add Tags (separated by comma ' , ')"
              type="text"
              name="tags"
              placeholder="Reactjs, Nextjs, Javascript"
              value={formData.tags}
              handleChange={handleChange}
              className="px-2 py-2 rounded-sm bg-black-200 text-white"
              disabled={loading}
            />
            <div className="flex justify-center items-center">
              <button
                className={`w-full mt-6 py-2 rounded-md bg-white text-black ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Updating... wait for a second" : "Edit Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
