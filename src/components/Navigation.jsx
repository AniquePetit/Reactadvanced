import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Flex } from '@chakra-ui/react'; // Gebruik Flex voor betere layoutcontrole

const Navigation = () => {
  return (
    <Box p="4" bg="teal.500">
      <Flex justify="space-between" align="center">
        {/* Link naar de homepagina */}
        <Button as={Link} to="/" color="white" fontSize="xl" fontWeight="bold">
          Home
        </Button>

        {/* Links naar de Add Event pagina */}
        <Flex>
          <Button as={Link} to="/add-event" color="white" mr={4}>
            Add Event
          </Button>
          {/* Optioneel: Als je een Events pagina wilt toevoegen */}
          <Button as={Link} to="/" color="white">
            Events
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navigation;
