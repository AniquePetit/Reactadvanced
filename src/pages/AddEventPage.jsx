import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Textarea, FormControl, FormLabel } from "@chakra-ui/react";

const AddEventPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [creator, setCreator] = useState("");  // Nieuw veld voor creator
  const [errorMessage, setErrorMessage] = useState("");

  // Functie om het formulier in te dienen
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validatie
    if (!title || !startTime || !endTime || !creator) {
      setErrorMessage("Titel, starttijd, eindtijd en creator zijn verplicht.");
      return;
    }

    // Zet de tijden om naar Date objecten
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Controleer of de eindtijd na de starttijd komt
    if (end <= start) {
      setErrorMessage("De eindtijd moet na de starttijd liggen.");
      return;
    }

    // Het nieuwe evenement object
    const newEvent = {
      title,
      description,
      startTime,
      endTime,
      image,
      categories,
      creator, // Voeg creator toe aan het evenement
    };

    // Stuur een POST-verzoek naar de backend om het evenement toe te voegen
    fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((response) => response.json())
      .then(() => {
        // Reset de velden na succesvolle toevoeging
        resetForm();
        navigate("/"); // Navigeer terug naar de evenementenlijst
      })
      .catch((error) => {
        console.error("Fout bij het toevoegen van het evenement:", error);
        setErrorMessage("Er is iets mis gegaan bij het toevoegen van het evenement.");
      });
  };

  // Reset functie om het formulier opnieuw leeg te maken
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setImage("");
    setCategories([]);
    setCreator("");  // Reset de creator
    setErrorMessage("");  // Reset de foutmelding
  };

  return (
    <Box p={5}>
      <h1>Nieuw Evenement Toevoegen</h1>
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
            value={categories}
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
          Voeg Evenement Toe
        </Button>
        <Button type="button" colorScheme="gray" mt={4} ml={4} onClick={resetForm}>
          Reset
        </Button>
      </form>
    </Box>
  );
};

export default AddEventPage;  