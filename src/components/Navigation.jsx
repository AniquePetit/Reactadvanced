import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Flex } from '@chakra-ui/react';

const Navigation = () => {
  return (
    <Box p="4" bg="teal.600">
      <Flex justify="space-between" align="center">
        {/* Link naar de homepagina */}
        <Button as={Link} to="/" color="black" fontSize="xl" fontWeight="bold" _hover={{ bg: 'teal.700' }}>
          Home
        </Button>

        {/* Links naar de Add Event pagina */}
        <Flex>
          <Button 
            as={Link} 
            to="/add-event" 
            color="black" 
            _hover={{ bg: 'teal.700' }} 
            mr={4
          }>
            Add Event
          </Button>
          <Button 
            as={Link} 
            to="/" 
            color="black" 
            _hover={{ bg: 'teal.700' }}
          >
            Events
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navigation;
