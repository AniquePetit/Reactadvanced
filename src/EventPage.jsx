import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Haal de details op van het specifieke evenement
    fetch(`http://localhost:3000/events/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Er is iets misgegaan met het ophalen van het evenement.");
        }
        return res.json();
      })
      .then((data) => setEvent(data))
      .catch((err) => {
        setError(err.message); // Bewaar de foutmelding in de state
        console.error("Fout bij ophalen evenement:", err);
      });
  }, [id]);

  if (error) {
    return <div style={{ color: "red" }}>Er is een fout opgetreden: {error}</div>;
  }

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p><strong>Start Time:</strong> {new Date(event.startTime).toLocaleString()}</p>
      <p><strong>End Time:</strong> {new Date(event.endTime).toLocaleString()}</p>
      <img src={event.image} alt={event.title} style={{ width: "300px", height: "auto" }} />
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
