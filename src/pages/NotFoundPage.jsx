

import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Box textAlign="center" mt={10}>
      <Heading>404 - Pagina niet gevonden</Heading>
      <Text mt={4}>De pagina die je zoekt bestaat niet.</Text>
      <Link to="/">
        <Button mt={6} colorScheme="teal">Terug naar Home</Button>
      </Link>
    </Box>
  );
};

export default NotFoundPage;