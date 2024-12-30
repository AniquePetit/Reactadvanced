import { useState } from "react";
import { useNavigate } from "react-router-dom";
const AddEventPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const handleAddEvent = (e) => {
    e.preventDefault();
    // Validatie van het formulier
    if (!title || !startTime || !endTime) {
      alert("Titel, starttijd en eindtijd zijn verplicht.");
      return;
    }
    const newEvent = {
      title,
      description,
      startTime,
      endTime,
      image,
      categories,
      creator: { name: "Admin", image: "default.png" }, // Voeg default creator toe
    };
    // Verzend het nieuwe evenement naar de back-end
    fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then(() => {
        navigate("/"); // Na het toevoegen van het evenement, ga terug naar de evenementenlijst
      })
      .catch((error) => {
        console.error("Er is een fout opgetreden bij het toevoegen van het evenement:", error);
        alert("Er is iets misgegaan bij het toevoegen van het evenement.");
      });
  };
  return (
    <div>
      <h1>Add New Event</h1>
      <form onSubmit={handleAddEvent}>
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