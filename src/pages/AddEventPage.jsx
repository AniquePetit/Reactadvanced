import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEventPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageError, setImageError] = useState(""); // New state for image URL error
  const navigate = useNavigate();

  const handleAddEvent = (e) => {
    e.preventDefault();
    
    // Reset errors before validation
    setErrorMessage("");
    setImageError("");

    // Form validation
    if (!title || !startTime || !endTime) {
      setErrorMessage("Title, start time, and end time are required.");
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      setErrorMessage("End time must be later than start time.");
      return;
    }
    if (image && !isValidImageUrl(image)) {
      setImageError("The image URL is invalid.");
      return;
    }

    const newEvent = {
      title,
      description,
      startTime,
      endTime,
      image,
      categories,
      creator: { name: "Admin", image: "default.png" },
    };

    // Send new event to the backend
    fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then(() => {
        navigate("/"); // Navigate back to the events list after adding
        // Reset form fields after successful submission
        setTitle("");
        setDescription("");
        setStartTime("");
        setEndTime("");
        setImage("");
        setCategories([]);
      })
      .catch((error) => {
        console.error("An error occurred while adding the event:", error);
        setErrorMessage("Something went wrong while adding the event.");
      });
  };

  // Function to validate image URL format
  const isValidImageUrl = (url) => {
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(url);
  };

  return (
    <div>
      <h1>Add New Event</h1>
      <form onSubmit={handleAddEvent}>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        {imageError && <div style={{ color: "red" }}>{imageError}</div>} {/* Image URL error */}

        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Start Time:</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Image URL:</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div>
          <label>Categories (comma separated):</label>
          <input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value.split(",").map(cat => cat.trim()))}
          />
        </div>

        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default AddEventPage;
