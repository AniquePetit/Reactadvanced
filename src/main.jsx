import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, Spinner } from '@chakra-ui/react';  // Importeer de Spinner van Chakra UI
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Dynamische import van de pagina's met lazy loading
const EventPage = React.lazy(() => import('./pages/EventPage'));
const EventsPage = React.lazy(() => import('./pages/EventsPage'));
const AddEventPage = React.lazy(() => import('./pages/AddEventPage'));
const EditEventPage = React.lazy(() => import('./pages/EditEventPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Root component importeren voor de router
import Root from './components/Root';

// Definiëren van de router en routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />, // Root component als basis voor de routes
    children: [
      { path: '/', element: <EventsPage /> },
      { path: '/event/:eventId', element: <EventPage /> },
      { path: '/edit-event/:eventId', element: <EditEventPage /> },
      { path: '/add-event', element: <AddEventPage /> },
      { path: '*', element: <NotFoundPage /> }, // Fallback voor niet bestaande routes
    ],
  },
]);

// Root element renderen met ChakraProvider en Suspense voor de pagina's
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      {/* Suspense met Spinner als fallback voor dynamisch geladen pagina's */}
      <Suspense
        fallback={
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <Spinner size="xl" color="teal.500" />
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </ChakraProvider>
  </React.StrictMode>
);
