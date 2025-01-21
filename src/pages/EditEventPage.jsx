import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, Select, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState(null);

  // Haal evenementgegevens op bij het laden van de pagina
  useEffect(() => {
    // Haal de categorieën op
    fetch('http://localhost:3000/categories')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data); // Zet de opgehaalde categorieën in de state
      })
      .catch((err) => setError('Fout bij het ophalen van categorieën'));

    // Haal evenement op
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
        setTitle(data.title);
        setDescription(data.description);
        setStartTime(data.startTime);
        setEndTime(data.endTime);
        setSelectedCategories(data.categories); // Zet de geselecteerde categorie-IDs
      })
      .catch((err) => setError('Fout bij het ophalen van evenementgegevens'));
  }, [eventId]);

  // Formulier indienen voor het bijwerken van het evenement
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !startTime || !endTime || selectedCategories.length === 0) {
      setError('Alle velden zijn verplicht.');
      return;
    }

    const updatedEvent = {
      title,
      description,
      startTime,
      endTime,
      categories: selectedCategories, // Stuur de geselecteerde categorieën (ID's)
    };

    fetch(`http://localhost:3000/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Er is iets mis gegaan bij het bijwerken van het evenement.');
        }
        return response.json();
      })
      .then(() => {
        toast({
          title: "Evenement bijgewerkt.",
          description: "Het evenement is succesvol bijgewerkt.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate(`/event/${eventId}`); // Navigeren naar de evenementpagina
      })
      .catch((err) => {
        setError('Er is iets mis gegaan bij het bijwerken van het evenement');
      });
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <Box p={5} maxW="md" mx="auto">
      <FormControl isInvalid={error}>
        <FormLabel>Title</FormLabel>
        <Input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Evenementtitel" 
        />
        <FormLabel mt={4}>Description</FormLabel>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Evenementbeschrijving"
        />
        <FormLabel mt={4}>Start Time</FormLabel>
        <Input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <FormLabel mt={4}>End Time</FormLabel>
        <Input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <FormLabel mt={4}>Categories</FormLabel>
        <Select
          multiple
          value={selectedCategories}
          onChange={(e) => setSelectedCategories([...e.target.selectedOptions].map(option => option.value))}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}> {/* Gebruik `category.id` i.p.v. `category._id` */}
              {category.name}
            </option>
          ))}
        </Select>

        {/* Foutmelding tonen */}
        {error && <div>{error}</div>}

        <Button mt={4} colorScheme="teal" onClick={handleSubmit}>
          Update Evenement
        </Button>
      </FormControl>
    </Box>
  );
};

export default EditEventPage;
