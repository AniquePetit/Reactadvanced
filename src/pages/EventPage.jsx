import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, Text, Image, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [eventsResponse, categoriesResponse] = await Promise.all([
          fetch(`http://localhost:3000/events/${eventId}`),
          fetch('http://localhost:3000/categories'),
        ]);

        if (!eventsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Fout bij het ophalen van gegevens');
        }

        const [eventData, categoriesData] = await Promise.all([
          eventsResponse.json(),
          categoriesResponse.json(),
        ]);

        if (!eventData) {
          throw new Error('Geen evenement gevonden met dit ID.');
        }

        setEvent(eventData);
        setAllCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Onbekende datum' : date.toLocaleString();
  };

  const getCategoryNames = (categoryIds) => {
    if (!Array.isArray(categoryIds)) return ['Onbekend'];

    return categoryIds
      .map((categoryId) => {
        const category = allCategories.find((cat) => cat.id === categoryId);
        return category ? category.name : 'Onbekende categorie';
      })
      .filter(Boolean);
  };

  const handleDelete = () => {
    setIsModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:3000/events/${event.id}`, {
        method: 'DELETE',
      });
      navigate('/'); // Redirect to the main events page after deleting
    } catch (err) {
      console.error('Error bij verwijderen:', err);
    }
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

  if (!event) {
    return <Text color="orange.500">Evenement niet gevonden. Controleer het ID en probeer het opnieuw.</Text>;
  }

  const eventCategories = getCategoryNames(event.categoryIds);

  return (
    <Box p={5}>
      <Heading>{event.title}</Heading>
      <Text mb={2}>{event.description}</Text>
      <Text mb={2}>
        <strong>Start Time:</strong> {parseDate(event.startTime)}
      </Text>
      <Text mb={2}>
        <strong>End Time:</strong> {parseDate(event.endTime)}
      </Text>
      <Image
        src={event.image ? event.image : '/images/default-placeholder.jpg'}
        alt={event.title || 'Evenement afbeelding'}
        boxSize="300px"
        objectFit="cover"
        mb={4}
      />
      <Text mb={2}>
        <strong>Categories:</strong> {eventCategories.join(', ')}
      </Text>
      <Text mb={2}>
        <strong>Creator:</strong> {event.creator}
      </Text>
      <Button colorScheme="blue" onClick={() => navigate(`/edit-event/${event.id}`)}>
        Bewerken
      </Button>
      <Button colorScheme="red" ml={2} onClick={handleDelete}>
        Verwijderen
      </Button>

      {/* Modal voor bevestiging van verwijdering */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verwijder evenement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Weet je zeker dat je dit evenement wilt verwijderen?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setIsModalOpen(false)}>
              Annuleren
            </Button>
            <Button colorScheme="red" ml={3} onClick={confirmDelete}>
              Verwijderen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EventPage;
