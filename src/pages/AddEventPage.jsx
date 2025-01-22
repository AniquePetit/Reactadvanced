import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, Select, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AddEventPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [categories, setCategories] = useState([]);  // De lijst van categorieën
  const [selectedCategory, setSelectedCategory] = useState('');  // Geselecteerde categorie
  const [image, setImage] = useState(null);  // Afbeeldingstate
  const toast = useToast();
  const navigate = useNavigate();

  // Statische gebruiker (creatorId kan bijvoorbeeld altijd dezelfde waarde zijn)
  const creatorId = 1;  // Hardcoded creator ID

  // Haal de categorieën op bij het laden van de pagina
  useEffect(() => {
    fetch('http://localhost:3000/categories')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);  // Zet de opgehaalde categorieën in de state
      })
      .catch((error) => console.error("Fout bij het ophalen van categorieën", error));
  }, []);

  // Handle afbeelding upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));  // Voorbeeld hoe je de afbeelding kunt weergeven
    }
  };

  // Handle submit voor het toevoegen van een evenement
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validatie voor verplichte velden
    if (!title || !description || !startTime || !endTime || !selectedCategory) {
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
      categoryId: parseInt(selectedCategory),  // Geselecteerde categorie ID
      image: image,  // Afbeelding URL
      createdBy: creatorId,  // Statische creator ID
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
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          placeholder="Selecteer een categorie"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>

        <FormLabel mt={4}>Afbeelding</FormLabel>
        <Input type="file" onChange={handleImageChange} />

        {image && <Box mt={2}><img src={image} alt="Geselecteerde afbeelding" style={{ width: '100%', height: 'auto' }} /></Box>}

        <Button mt={4} colorScheme="teal" onClick={handleSubmit}>
          Voeg Evenement Toe
        </Button>
      </FormControl>
    </Box>
  );
};

export default AddEventPage;
