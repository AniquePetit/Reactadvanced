import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Textarea, FormControl, FormLabel, Select, Spinner, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [image, setImage] = useState('');
  const [categoryIds, setCategoryIds] = useState([]); 
  const [creator, setCreator] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [allCategories, setAllCategories] = useState([]);

 
  useEffect(() => {
    if (eventId) {
      setLoading(true);

      Promise.all([
        fetch(`http://localhost:3000/events/${eventId}`),
        fetch('http://localhost:3000/categories'),
      ])
        .then(([eventResponse, categoriesResponse]) => {
          if (!eventResponse.ok || !categoriesResponse.ok) {
            throw new Error('Error fetching event or categories');
          }
          return Promise.all([eventResponse.json(), categoriesResponse.json()]);
        })
        .then(([eventData, categoriesData]) => {
          setTitle(eventData.title || '');
          setDescription(eventData.description || '');
          setStartTime(eventData.startTime || '');
          setEndTime(eventData.endTime || '');
          setImage(eventData.image || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg');
          setCategoryIds(eventData.categoryIds || []); 
          setCreator(eventData.creator ? eventData.creator.name : '');
          setAllCategories(categoriesData);
        })
        .catch((error) => {
          setErrorMessage("Error fetching event data");
        })
        .finally(() => setLoading(false));
    }
  }, [eventId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      setErrorMessage('End time must be after start time.');
      return;
    }

    if (!title || !startTime || !endTime || !creator || categoryIds.length === 0) {
      setErrorMessage('Title, start time, end time, creator, and categories are required.');
      return;
    }

    const eventData = {
      title,
      description,
      startTime,
      endTime,
      image,
      categoryIds, 
      creator,
    };

    const url = eventId ? `http://localhost:3000/events/${eventId}` : 'http://localhost:3000/events';
    const method = eventId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
      .then(() => {
        toast({
          title: eventId ? 'Event Updated' : 'New Event Added',
          description: eventId ? 'Event updated successfully.' : 'Event added successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      })
      .catch((error) => {
        setErrorMessage('Error saving event.');
      });
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('');
    setEndTime('');
    setImage('');
    setCategoryIds([]);
    setCreator('');
    setErrorMessage('');
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Box p={5}>
      <h1>{eventId ? 'Edit Event' : 'Add New Event'}</h1>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>Title</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event Title" />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Description</FormLabel>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Event Description" />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Start Time</FormLabel>
          <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>End Time</FormLabel>
          <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Image URL</FormLabel>
          <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Categories</FormLabel>
          <Select
            value={categoryIds[0] || ''}
            onChange={(e) => setCategoryIds([e.target.value])}
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
          <Input value={creator} onChange={(e) => setCreator(e.target.value)} placeholder="Creator Name" />
        </FormControl>

        <Button type="submit" colorScheme="teal" mt={4}>
          {eventId ? 'Save Event' : 'Add Event'}
        </Button>
        <Button type="button" colorScheme="gray" mt={4} ml={4} onClick={resetForm}>
          Reset
        </Button>
      </form>
    </Box>
  );
};

export default EditEventPage;
