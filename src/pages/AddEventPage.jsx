import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, Select, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AddEventPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [categories, setCategories] = useState([]);  // Dit is de lijst van categorieën die we ophalen
  const [selectedCategories, setSelectedCategories] = useState([]);  // Hier slaan we de geselecteerde categorie-IDs op
  const toast = useToast();
  const navigate = useNavigate();

  // Haal de categorieën op bij het laden van de pagina
  useEffect(() => {
    fetch('http://localhost:3000/categories')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);  // Zet de opgehaalde categorieën in de state
      })
      .catch((error) => console.error("Fout bij het ophalen van categorieën", error));
  }, []);

  // Handle submit voor het toevoegen van een evenement
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validatie voor verplichte velden
    if (!title || !description || !startTime || !endTime || selectedCategories.length === 0) {
      toast({
        title: 'Fout',
        description: 'Alle velden zijn verplicht.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Formulierdata verzenden naar de server
    const newEvent = {
      title,
      description,
      startTime,
      endTime,
      categoryIds: selectedCategories, // Hier worden de geselecteerde categorie-IDs verstuurd
    };

    fetch('http://localhost:3000/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    })
    .then((response) => response.json())
    .then(() => {
      toast({
        title: 'Evenement toegevoegd',
        description: 'Het evenement is succesvol toegevoegd.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/'); // Navigeren naar de evenementenlijst
    })
    .catch((err) => {
      console.error("Fout bij het toevoegen van evenement", err);
    });
  };

  return (
    <Box p={5} maxW="md" mx="auto">
      <FormControl>
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
          placeholder="Selecteer een of meerdere categorieën"
          onChange={(e) => setSelectedCategories([...e.target.selectedOptions].map(option => option.value))}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}> {/* Gebruik `category.id` i.p.v. `category._id` */}
              {category.name}
            </option>
          ))}
        </Select>

        <Button mt={4} colorScheme="teal" onClick={handleSubmit}>
          Voeg Evenement Toe
        </Button>
      </FormControl>
    </Box>
  );
};

export default AddEventPage;
