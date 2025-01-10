import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import EventPage from './pages/EventPage';
import EventsPage from './pages/EventsPage';
import AddEventPage from './pages/AddEventPage';
import EditEventPage from './pages/EditEventPage';
import Root from './components/Root';
import NotFoundPage from './pages/NotFoundPage';  // Importeer de NotFoundPage

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,  // Root component is de basis
    children: [
      { path: '/', element: <EventsPage /> },
      { path: '/event/:eventId', element: <EventPage /> },
      { path: '/edit-event/:eventId', element: <EditEventPage /> },
      { path: '/add-event', element: <AddEventPage /> },
      { path: '*', element: <NotFoundPage /> }, // Voeg de 404 pagina toe als fallback
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);  