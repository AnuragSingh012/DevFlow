import { useState } from "react";
import FormField from "../components/FormField";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    img: "",
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Split tags by comma and trim whitespace
    const tagsArray = formData.tags.split(",").map((tag) => tag.trim());

    // Create post object
    const post = {
      title: formData.title,
      description: formData.description,
      img: formData.img,
      tags: tagsArray,
      author: "author_id_placeholder", // Replace with actual author ID
    };

    try {
      const response = await fetch("http://localhost:3000/post", {
        // Use port 5000 to match your backend
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(post),
      });

      if (response.ok) {
        // Handle successful post creation
        console.log("Post created successfully");
      } else {
        // Handle errors
        console.error("Error creating post");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-black-100 text-white w-full p-8 sm:px-[50px] sm:py-[20px] md:px-[100px] md:py-[40px] lg:px-[400px] lg:py-[40px] flex justify-center items-center">
      <div className="w-full">
        <div>
          <h1 className="font-bold text-4xl">Create Post</h1>
        </div>
        <div>
          <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
            <FormField
              labelName="Title"
              type="text"
              name="title"
              placeholder="Enter Title"
              value={formData.title}
              handleChange={handleChange}
              className="px-2 py-2 rounded-sm bg-black-200 text-white"
            />
            <FormField
              labelName="Description"
              type="textarea"
              name="description"
              placeholder="Enter Description"
              value={formData.description}
              handleChange={handleChange}
              className="px-2 py-2 rounded-sm bg-black-200 text-white"
            />
            <FormField
              labelName="Add Image"
              type="text"
              name="img"
              placeholder="Add Image Link"
              value={formData.img}
              handleChange={handleChange}
              className="px-2 py-2 rounded-sm bg-black-200 text-white"
            />
            <FormField
              labelName="Add Tags (separated by comma ' , ')"
              type="text"
              name="tags"
              placeholder="Reactjs, Nextjs, Javascript"
              value={formData.tags}
              handleChange={handleChange}
              className="px-2 py-2 rounded-sm bg-black-200 text-white"
            />
            <div className="flex justify-center items-center">
              <button
                className="w-full mt-6 py-2 rounded-md bg-white text-black"
                type="submit"
              >
                Create Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
