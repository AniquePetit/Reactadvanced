import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary"; // Importeer ErrorBoundary
import EventsPage from "./pages/EventsPage"; // Zorg ervoor dat EventsPage correct is geïmporteerd
import EventPage from "./pages/EventPage";   // Zorg ervoor dat EventPage correct is geïmporteerd
import AddEventPage from "./pages/AddEventPage"; // Importeer de nieuwe pagina
// Foutweergave component
const ErrorFallback = ({ error }) => {
  return (
    <div style={{ padding: '20px', background: 'red', color: 'white' }}>
      <h2>Er is iets misgegaan:</h2>
      <p>{error.message}</p>
    </div>
  );
};
const App = () => {
  return (
    <ChakraProvider>
      <Router>
        {/* Wrapping routes in ErrorBoundary to catch errors */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            {/* De route voor de lijst van evenementen */}
            <Route path="/" element={<EventsPage />} />
            {/* De route voor de detailpagina van een specifiek evenement */}
            <Route path="/event/:id" element={<EventPage />} />
            {/* De route voor het toevoegen van een nieuw evenement */}
            <Route path="/add-event" element={<AddEventPage />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </ChakraProvider>
  );
};
export default App;