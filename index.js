// src/app.js

const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const ImageController = require('./controllers/ImageController');

const app = express();
const port = process.env.PORT || 3000;

const expectedAppKey = process.env.APP_KEY;
const imageController = new ImageController(
  process.env.API_KEY,
  process.env.PROJECT_ID,
  process.env.FIRESTORE,
  process.env.GCS_BUCKET_NAME,
  process.env.COLLECTION_NAME
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Nando!');
});

// Image analysis endpoint
app.post('/analyzeImage', (req, res) => {
  if (req.headers['x-app-key'] !== expectedAppKey) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }
  imageController.analyzeImage(req, res);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
