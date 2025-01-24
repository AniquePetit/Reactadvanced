import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Textarea, FormControl, FormLabel, Spinner, Select, useToast } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState(''); // Single category
  const [allCategories, setAllCategories] = useState([]);
  const [creator, setCreator] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [event, setEvent] = useState(null);

  // Fetch the event data and categories
  useEffect(() => {
    if (eventId) {
      setLoading(true);

      // Fetch the event and categories
      Promise.all([
        fetch(`http://localhost:3000/events/${eventId}`),
        fetch('http://localhost:3000/categories')
      ])
        .then(([eventResponse, categoriesResponse]) => {
          if (!eventResponse.ok || !categoriesResponse.ok) {
            throw new Error('Fout bij het ophalen van evenement of categorieën');
          }
          return Promise.all([eventResponse.json(), categoriesResponse.json()]);
        })
        .then(([eventData, categoriesData]) => {
          setEvent(eventData);
          setAllCategories(categoriesData); // Set all categories
          setTitle(eventData.title);
          setDescription(eventData.description);
          setStartTime(eventData.startTime);
          setEndTime(eventData.endTime);
          setImage(eventData.image || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg');
          setCategory(eventData.category || ''); // Set the category for single selection
          if (eventData.creator && typeof eventData.creator === "object") {
            setCreator(eventData.creator.name);
          } else {
            setCreator(eventData.creator);
          }
        })
        .catch((error) => {
          console.error("Error fetching event:", error);
          setErrorMessage("Er is iets mis gegaan bij het ophalen van het evenement.");
        })
        .finally(() => setLoading(false));
    }
  }, [eventId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      setErrorMessage('De eindtijd moet na de starttijd liggen.');
      return;
    }

    if (!title || !startTime || !endTime || !creator || !category) {
      setErrorMessage('Titel, starttijd, eindtijd, creator en categorie zijn verplicht.');
      return;
    }

    const eventData = {
      title,
      description,
      startTime,
      endTime,
      image,
      category, // Send only a single category
      creator,
    };

    const url = eventId ? `http://localhost:3000/events/${eventId}` : 'http://localhost:3000/events';
    const method = eventId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
      .then(() => {
        toast({
          title: eventId ? 'Evenement bijgewerkt' : 'Nieuw evenement toegevoegd',
          description: eventId
            ? 'Het evenement is succesvol bijgewerkt.'
            : 'Het evenement is succesvol toegevoegd.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      })
      .catch((error) => {
        console.error('Fout bij het toevoegen of bijwerken van het evenement:', error);
        setErrorMessage('Er is iets mis gegaan bij het toevoegen of bijwerken van het evenement.');
      });
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('');
    setEndTime('');
    setImage('');
    setCategory(''); // Reset single category
    setCreator('');
    setErrorMessage('');
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box p={5}>
      <h1>{eventId ? 'Evenement Bijwerken' : 'Nieuw Evenement Toevoegen'}</h1>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

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

        <FormControl mb={4} isRequired>
          <FormLabel>Categorie</FormLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Selecteer een categorie"
          >
            {allCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
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
          {eventId ? 'Sla Evenement Op' : 'Voeg Evenement Toe'}
        </Button>
        <Button type="button" colorScheme="gray" mt={4} ml={4} onClick={resetForm}>
          Reset
        </Button>
      </form>

      {event && (
        <Box mt={5}>
          <img src={event.image || 'https://via.placeholder.com/300'} alt={event.title} style={{ maxWidth: '100%' }} />
        </Box>
      )}
    </Box>
  );
};

export default EditEventPage;
