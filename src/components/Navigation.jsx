import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '@chakra-ui/react';

const Navigation = () => {
  return (
    <Box display="flex" justifyContent="space-around" p="4" bg="teal.500">
      <Button as={Link} to="/" color="white">
        Home
      </Button>
      <Button as={Link} to="/add-event" color="white">
        Add Event
      </Button>
    </Box>
  );
};

export default Navigation;
