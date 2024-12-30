import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);  // New loading state for better UX

  useEffect(() => {
    // Fetch the details of the specific event
    setLoading(true); // Reset loading to true when making a new request
    fetch(`http://localhost:3000/events/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Something went wrong while fetching the event.");
        }
        return res.json();
      })
      .then((data) => {
        setEvent(data);
        setLoading(false);  // Set loading to false when data is fetched
      })
      .catch((err) => {
        setError(err.message);  // Save the error message to state
        setLoading(false);  // Stop loading even if there's an error
        console.error("Error fetching event:", err);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;  // You can improve this with a spinner or animation
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  if (!event) {
    return <div>No event found.</div>;
  }

  // Handle missing or broken image URL
  const handleImageError = (e) => {
    e.target.src = "default-image-url.jpg"; // Set a fallback image if the event's image fails to load
  };

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p><strong>Start Time:</strong> {new Date(event.startTime).toLocaleString()}</p>
      <p><strong>End Time:</strong> {new Date(event.endTime).toLocaleString()}</p>

      {/* Image with error handling */}
      <img
        src={event.image}
        alt={event.title}
        onError={handleImageError}
        style={{ width: "300px", height: "auto" }}
      />

      <div>
        <strong>Categories:</strong> {event.categories.join(", ")}
      </div>
      <div>
        <strong>Creator:</strong> {event.creator.name}
      </div>
    </div>
  );
};

export default EventPage;
