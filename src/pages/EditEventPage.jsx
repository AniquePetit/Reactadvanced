import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Input, Textarea, FormControl, FormLabel, useToast } from "@chakra-ui/react";

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [creator, setCreator] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Haal data van een bestaand evenement op als er een eventId is
  useEffect(() => {
    if (eventId) {
      fetch(`http://localhost:3000/events/${eventId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch event data.");
          }
          return response.json();
        })
        .then((data) => {
          setTitle(data.title);
          setDescription(data.description);
          setStartTime(data.startTime);
          setEndTime(data.endTime);
          setImage(data.image);
          setCategories(data.categories);
          setCreator(typeof data.creator === "object" ? data.creator.name : data.creator);
        })
        .catch((error) => {
          console.error("Error fetching event:", error);
          setErrorMessage("Er is iets mis gegaan bij het ophalen van het evenement.");
        });
    }
  }, [eventId]);

  // Formulier indienen
  const handleSubmit = (e) => {
    e.preventDefault();

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      setErrorMessage("De eindtijd moet na de starttijd liggen.");
      return;
    }

    if (!title || !startTime || !endTime || !creator) {
      setErrorMessage("Titel, starttijd, eindtijd en creator zijn verplicht.");
      return;
    }

    const eventData = {
      title,
      description,
      startTime,
      endTime,
      image,
      categories,
      creator,
    };

    const url = eventId
      ? `http://localhost:3000/events/${eventId}` // Update bestaand evenement
      : "http://localhost:3000/events"; // Voeg nieuw evenement toe
    const method = eventId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save event data.");
        }
        return response.json();
      })
      .then(() => {
        toast({
          title: eventId ? "Evenement bijgewerkt" : "Nieuw evenement toegevoegd",
          description: eventId ? "Het evenement is succesvol bijgewerkt." : "Het evenement is succesvol toegevoegd.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      })
      .catch((error) => {
        console.error("Error saving event:", error);
        setErrorMessage("Er is iets mis gegaan bij het opslaan van het evenement.");
      });
  };

  // Reset formulier
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setImage("");
    setCategories([]);
    setCreator("");
    setErrorMessage("");
  };

  return (
    <Box p={5}>
      <h1>{eventId ? "Evenement Bijwerken" : "Nieuw Evenement Toevoegen"}</h1>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>Titel</FormLabel>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel van het evenement"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Beschrijving</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschrijving van het evenement"
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Starttijd</FormLabel>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Eindtijd</FormLabel>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Afbeelding URL</FormLabel>
          <Input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="URL van de afbeelding"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Categorieën (gescheiden door komma)</FormLabel>
          <Input
            type="text"
            value={categories.join(", ")}
            onChange={(e) => setCategories(e.target.value.split(",").map((cat) => cat.trim()))}
            placeholder="Categorieën"
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Creator</FormLabel>
          <Input
            type="text"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            placeholder="Naam van de maker"
          />
        </FormControl>

        <Button type="submit" colorScheme="teal" mt={4}>
          {eventId ? "Sla Evenement Op" : "Voeg Evenement Toe"}
        </Button>
        <Button type="button" colorScheme="gray" mt={4} ml={4} onClick={resetForm}>
          Reset
        </Button>
      </form>
    </Box>
  );
};

export default EditEventPage;
