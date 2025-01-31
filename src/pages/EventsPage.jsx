import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Select, Spinner, Text, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const CustomButton = ({ to, colorScheme, children }) => {
  return (
    <Button as={Link} to={to} colorScheme={colorScheme} mt="4">
      {children}
    </Button>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    fetch('http://localhost:3000/categories')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Fout bij het ophalen van categorieën');
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => setError('Fout bij het ophalen van categorieën'))
      .finally(() => setLoading(false));

    fetch('http://localhost:3000/events')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Er is iets mis gegaan bij het ophalen van evenementen');
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        setFilteredEvents(data);
      })
      .catch((err) => setError('Er is iets mis gegaan bij het ophalen van evenementen'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;

    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === '' || event.categoryIds.includes(parseInt(selectedCategory));
      return matchesSearch && matchesCategory;
    });

    setFilteredEvents(filtered);
  }, [events, search, selectedCategory, loading]);

  const getCategoryNames = (categoryIds) => {
    return categoryIds
      ? categoryIds
          .map((categoryId) => {
            const category = categories.find((cat) => cat.id === categoryId);
            return category ? category.name : null;
          })
          .filter(Boolean)
      : ['Onbekend'];
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return (
      <Text color="red.500" mt="4">
        {error}
      </Text>
    );
  }

  return (
    <Box p="4">
      {/* Zoekveld */}
      <Input
        placeholder="Zoek evenementen"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb="4"
      />

      {/* Categorieën dropdown */}
      <Select
        placeholder="Selecteer een categorie"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        mb="4"
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

      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap="4">
        {filteredEvents.length === 0 ? (
          <Text>Geen evenementen gevonden.</Text>
        ) : (
          filteredEvents.map((event) => (
            <Box key={event.id} p="4" borderWidth="1px" borderRadius="lg">
              <Image
                src={event.image ? event.image : 'https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg'}
                alt={event.title}
                boxSize="200px"
                objectFit="cover"
                mb="4"
              />
              <Text fontWeight="bold" mb="2">{event.title}</Text>
              <Text>{event.description}</Text>
              <Text mt="2">
                <strong>Categories:</strong> {getCategoryNames(event.categoryIds).join(', ')}
              </Text>
              <CustomButton to={`/event/${event.id}`} colorScheme="teal">
                Meer details
              </CustomButton>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default EventsPage;
