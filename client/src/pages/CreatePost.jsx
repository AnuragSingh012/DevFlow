import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";

const CreatePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State to track loading state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    img: null, // Use null for file upload
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      // Handle file separately
      setFormData({
        ...formData,
        [name]: e.target.files[0], // Store the file object
      });
    } else if (name === 'tags') {
      // Handle tags input as a comma-separated string and convert to array
      const tagsArray = value.split(',').map(tag => tag.trim());
      setFormData({
        ...formData,
        [name]: tagsArray,
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
    setLoading(true); // Set loading to true on form submit
  
    // Prepare FormData for file upload
    const postData = new FormData();
    postData.append("title", formData.title);
    postData.append("description", formData.description);
    formData.tags.forEach((tag, index) => {
      postData.append(`tags[${index}]`, tag);
    });
    postData.append("image", formData.img); // Append the image file
  
    try {
      const response = await fetch("http://localhost:3000/post", {
        method: "POST",
        credentials: "include",
        body: postData, // Use FormData for file upload
      });
  
      if (response.ok) {
        console.log("Post created successfully");
        // Navigate to '/' after successful post creation
        navigate('/');
      } else {
        console.error("Error creating post");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false after form submission completes
    }
  };
  

  return (
    <div className="bg-black-100 text-white w-full p-8 sm:px-[50px] sm:py-[20px] md:px-[100px] md:py-[40px] lg:px-[400px] lg:py-[40px] flex justify-center items-center">
      <div className="w-full">
        <div>
          <h1 className="font-bold text-4xl">Create Post</h1>
        </div>
        <div>
          <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit} encType="multipart/form-data">
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
              disabled={loading} // Disable input while loading
            />
            <FormField
              labelName="Content"
              type="textarea"
              name="description"
              placeholder="Enter Content"
              value={formData.description}
              handleChange={handleChange}
              className="px-2 py-2 rounded-sm bg-black-200 text-white"
              disabled={loading} // Disable input while loading
            />
            <FormField
              labelName="Add Image"
              type="file"
              name="img"
              id="img"
              handleChange={handleChange}
              className="px-2 py-2 rounded-sm bg-black-200 text-white"
              disabled={loading} // Disable input while loading
            />
            <FormField
              labelName="Add Tags (separated by comma ' , ')"
              type="text"
              name="tags"
              placeholder="Reactjs, Nextjs, Javascript"
              value={formData.tags}
              handleChange={handleChange}
              className="px-2 py-2 rounded-sm bg-black-200 text-white"
              disabled={loading} // Disable input while loading
            />
            <div className="flex justify-center items-center">
              <button
                className={`w-full mt-6 py-2 rounded-md bg-white text-black ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Creating... wait for a second' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
