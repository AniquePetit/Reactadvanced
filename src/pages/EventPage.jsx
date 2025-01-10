import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Box, Heading, Text, Image, Button, useToast } from "@chakra-ui/react";

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast(); // ChakraUI toast voor berichten
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong while fetching the event.");
        }
        return response.json();
      })
      .then((data) => {
        setEvent(data);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
        setError("Failed to load the event.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eventId]);

  // Handle delete event
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      fetch(`http://localhost:3000/events/${eventId}`, { method: "DELETE" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete the event.");
          }
          // On success, show a success message and redirect
          toast({
            title: "Event deleted.",
            description: "The event has been successfully deleted.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          navigate("/"); // Redirect to the events list
        })
        .catch((err) => {
          console.error("Error deleting event:", err);
          setError("Failed to delete the event.");
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!event) {
    return <div>No event found.</div>;
  }

  return (
    <Box p={5}>
      <Heading>{event.title}</Heading>
      <Text mb={2}>{event.description}</Text>
      <Text mb={2}>
        <strong>Start Time:</strong> {new Date(event.startTime).toLocaleString()}
      </Text>
      <Text mb={2}>
        <strong>End Time:</strong> {new Date(event.endTime).toLocaleString()}
      </Text>
      {event.image && (
        <Image
          src={event.image}
          alt={event.title}
          onError={(e) => (e.target.src = "default-image-url.jpg")}
          boxSize="300px"
          objectFit="cover"
          mb={4}
        />
      )}
      <Text mb={2}>
        <strong>Categories:</strong> {event.categories ? event.categories.join(", ") : "None"}
      </Text>
      <Text mb={4}>
        <strong>Creator:</strong> {event.creator ? event.creator.name : "Unknown"}
      </Text>

      <Link to={`/edit-event/${event.id}`}>
        <Button colorScheme="blue" mt={4}>
          Edit
        </Button>
      </Link>

      <Button colorScheme="red" mt={4} ml={4} onClick={handleDelete}>
        Delete
      </Button>
    </Box>
  );
};

export default EventPage;
