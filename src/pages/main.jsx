import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import EventPage from './pages/EventPage'; // Updated import (if default export)
import EventsPage from './pages/EventsPage'; // Updated import (if default export)
import AddEventPage from './pages/AddEventPage'; // Correctly imported AddEventPage
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './components/Root'; // Ensure Root component is correct

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,  // Root component is the layout for nested routes
    children: [
      {
        path: '/',  // Home route, loads EventsPage
        element: <EventsPage />,
      },
      {
        path: '/event/:eventId',  // Event detail page
        element: <EventPage />,
      },
      {
        path: '/add-event',  // Add event page
        element: <AddEventPage />,
      },
    ],
  },
]);

// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
