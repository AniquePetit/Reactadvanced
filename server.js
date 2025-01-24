import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());


const readJsonFile = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      throw new Error('Not a valid file');
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading or parsing file: ${filePath}`, error);
    return null;
  }
};


app.get('/api/events', (req, res) => {
  const filePath = path.join(__dirname, 'src', 'data', 'events.json');
  const eventsData = readJsonFile(filePath);

  if (eventsData) {
    res.json(eventsData);
  } else {
    res.status(500).json({ error: 'Could not load events data.' });
  }
});


app.get('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const filePath = path.join(__dirname, 'src', 'data', 'events.json');
  const eventsData = readJsonFile(filePath);

  if (eventsData) {
    const event = eventsData.find(event => event.id === id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } else {
    res.status(500).json({ error: 'Could not load events data.' });
  }
});


app.get('/api/categories', (req, res) => {
  const filePath = path.join(__dirname, 'src', 'data', 'categories.json');
  const categoriesData = readJsonFile(filePath);

  if (categoriesData) {
    res.json(categoriesData);
  } else {
    res.status(500).json({ error: 'Could not load categories data.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
