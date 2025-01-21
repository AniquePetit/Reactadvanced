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
        setError('Fout bij het ophalen van categorieë
