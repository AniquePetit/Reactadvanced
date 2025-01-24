import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Textarea, FormControl, FormLabel, Select, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AddEventPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState(''); // Single category
  const [image, setImage] = useState('');
  const [categories, setCategories] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  // Ophalen van categorieën bij het laden van de pagina
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/categories');
        if (!response.ok) {
          throw new Error('Fout bij het ophalen van categorieën');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast({
          title: 'Fout bij ophalen categorieën.',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchCategories();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      title,
      description,
      startTime,
      endTime,
      category,
      image,
    };

    try {
      const response = await fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error('Er is een probleem opgetreden bij het aanmaken van het evenement.');
      }

      const createdEvent = await response.json();

      toast({
        title: 'Evenement aangemaakt!',
        description: `Het evenement "${createdEvent.title}" is succesvol aangemaakt.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate(`/event/${createdEvent.id}`);
    } catch (error) {
      toast({
        title: 'Fout bij het aanmaken van evenement.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p="4">
      <form onSubmit={handleSubmit}>
        <FormControl mb="4" isRequired>
          <FormLabel>Titel</FormLabel>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel van het evenement"
          />
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Beschrijving</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschrijving van het evenement"
          />
        </FormControl>

        <FormControl mb="4" isRequired>
          <FormLabel>Starttijd</FormLabel>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </FormControl>

        <FormControl mb="4" isRequired>
          <FormLabel>Eindtijd</FormLabel>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Afbeelding URL</FormLabel>
          <Input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="URL van de afbeelding"
          />
        </FormControl>

        <FormControl mb="4" isRequired>
          <FormLabel>Categorie</FormLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Selecteer een categorie"
            isRequired
          >
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option value="">Geen categorieën beschikbaar</option>
            )}
          </Select>
        </FormControl>

        <Button colorScheme="blue" type="submit">
          Maak Evenement Aan
        </Button>
      </form>
    </Box>
  );
};

export default AddEventPage;
