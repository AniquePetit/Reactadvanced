import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, Text, Image, Spinner } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);  // Alleen geselecteerde categorieën
  const [allCategories, setAllCategories] = useState([]);  // Alle categorieën om namen te matchen
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Haal evenementgegevens en categorieën op
  useEffect(() => {
    setLoading(true);

    // Haal het evenement lokaal op
    fetch('/src/data/events.json')  // Pas de JSON-bestand correct aan
      .then((response) => {
        if (!response.ok) {
          throw new Error('Fout bij het ophalen van evenementgegevens');
        }
        return response.json();
      })
      .then((data) => {
        const foundEvent = data.find(e => e.id === parseInt(eventId));
        if (foundEvent) {
          setEvent(foundEvent);
          setCategories(foundEvent.categoryIds);  // Zet de categorie-ID's in de state
        } else {
          setError('Geen evenement gevonden met dit ID.');
        }
      })
      .catch((err) => {
        setError('Fout bij het ophalen van evenementgegevens');
      });

    // Haal alle categorieën lokaal op
    fetch('/src/data/categories.json')  // Pas de JSON-bestand correct aan
      .then((response) => {
        if (!response.ok) {
          throw new Error('Fout bij het ophalen van categorieën');
        }
        return response.json();
      })
      .then((data) => {
        setAllCategories(data);  // Zet de lijst van alle categorieën in de state
      })
      .catch((err) => {
        setError('Fout bij het ophalen van categorieën');
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  if (!event) {
    return <Text>Geen evenement gevonden.</Text>;
  }

  // Verkrijg de categorie-namen door de IDs te matchen
  const eventCategories = getCategoryNames(categories, allCategories);

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
      <Image
        src={event.image || '/images/default-placeholder.jpg'}  // Lokaal verwijzen naar standaard afbeelding
        alt={event.title}
        boxSize="300px"
        objectFit="cover"
        mb={4}
      />
      <Text mb={2}>
        <strong>Categories:</strong> {eventCategories.join(', ')} 
      </Text>
      <Button colorScheme="blue" onClick={() => navigate(`/edit-event/${event.id}`)}>
        Bewerken
      </Button>
    </Box>
  );
};

export default EventPage;
