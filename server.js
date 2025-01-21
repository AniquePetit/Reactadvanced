import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Helperfunctie om JSON-bestanden veilig te lezen
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading or parsing file: ${filePath}`, error);
    return null;
  }
};

// Route voor evenementen ophalen
app.get('/api/events', (req, res) => {
  const filePath = path.join(__dirname, 'src', 'data', 'events.json');
  const eventsData = readJsonFile(filePath);

  if (eventsData) {
    res.json(eventsData);
  } else {
    res.status(500).json({ error: 'Could not load events data.' });
  }
});

// Route voor categorieën ophalen
app.get('/api/categories', (req, res) => {
  const filePath = path.join(__dirname, 'src', 'data', 'categories.json');
  const categoriesData = readJsonFile(filePath);

  if (categoriesData) {
    res.json(categoriesData);
  } else {
    res.status(500).json({ error: 'Could not load categories data.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
