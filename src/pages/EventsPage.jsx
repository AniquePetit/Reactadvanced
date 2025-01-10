import React, { useState, useEffect } from 'react';
import { Box, Button, Text, Image, Select, Input } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Haal evenementen op van de server
  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Er is een probleem met het ophalen van de evenementen.");
        }
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setFilteredEvents(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  // Haal alle unieke categorieën uit de evenementen
  const categories = [...new Set(events.flatMap(event => event.categories))];

  // Filter de evenementen op basis van zoekopdracht en geselecteerde categorie
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    filterEvents(e.target.value, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    filterEvents(search, e.target.value);
  };

  const filterEvents = (search, category) => {
    let filtered = events;

    if (search) {
      filtered = filtered.filter((event) => event.title.toLowerCase().includes(search.toLowerCase()));
    }

    if (category) {
      filtered = filtered.filter((event) => event.categories.includes(category));
    }

    setFilteredEvents(filtered);
  };

  if (error) {
    return <div style={{ color: "red" }}>Fout: {error}</div>;
  }

  return (
    <Box p="4">
      <Text fontSize="2xl" mb="4">Evenementenlijst</Text>

      {/* Zoekveld */}
      <Input
        placeholder="Zoek evenement"
        value={search}
        onChange={handleSearchChange}
        mb="4"
      />

      {/* Filter categorieën */}
      <Select
        placeholder="Selecteer een categorie"
        value={selectedCategory}
        onChange={handleCategoryChange}
        mb="4"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </Select>

      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap="4">
        {filteredEvents.length === 0 ? (
          <Text>Geen evenementen gevonden.</Text>
        ) : (
          filteredEvents.map((event) => (
            <Box key={event.id} p="4" borderWidth="1px" borderRadius="lg">
              <Image
                src={event.image || "default-image-url.jpg"} // Fallback image
                alt={event.title}
                boxSize="200px"
                objectFit="cover"
                mb="4"
              />
             <Text fontWeight="bold" mb="2">{event.title}</Text>
<Text>{event.description}</Text>
<Button as={Link} to={`/event/${event.id}`} colorScheme="teal" mt="4">
  Meer details
</Button>

            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default EventsPage;  