// index.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } =  require("@google/generative-ai/server");
const { Storage } = require('@google-cloud/storage');
require('dotenv').config();
const express = require('express');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
const storage = new Storage(); // Instantiate Storage
const app = express();
const { v4: uuidv4 } = require('uuid');
const path = require('path');


const port = process.env.PORT || 3000;
const expectedAppKey = process.env.APP_KEY;

// Middleware to parse JSON bodies
app.use(express.json());  // for parsing application/json

app.get('/', (req, res) => {
  res.send('Hello, Cloud Run!');
});

// Image analysis endpoint
app.post('/analyzeImage', async (req, res) => {
    try {
      // Validate the API key from headers
      if (!isValidApiKey(req.headers['x-app-key'])) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
  
      // Extract prompt and image URL from request body
      const { prompt, imageUrl } = req.body;
      const mimeType = await getImageMimeType(imageUrl);
      
      const fileName = uuidv4();
      const tempFilePath = await uploadImageToGCS(imageUrl, fileName, mimeType);
  
      const result = await generateContentFromImage(prompt, tempFilePath);
  
      res.status(200).send(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      res.status(500).json({ error: 'Error analyzing image' });
    }
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
  
  // Helper Functions
  
  // Check if the provided API key is valid
  function isValidApiKey(providedApiKey) {
    return providedApiKey && providedApiKey === expectedAppKey;
  }
  
  // Get MIME type of the image
  async function getImageMimeType(imageUrl) {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.headers.get('Content-Type') || 'image/jpeg'; // Default to 'image/jpeg'
  }
  
  // Upload the image to Google Cloud Storage
  async function uploadImageToGCS(imageUrl, fileName, mimeType) {
    const bucketName = process.env.GCS_BUCKET_NAME;
    const buffer = await fetchImageBuffer(imageUrl);
    const file = storage.bucket(bucketName).file(fileName);
  
    await file.save(buffer, { metadata: { contentType: mimeType } });
  
    const tempFilePath = await downloadImageFromGCS(bucketName, fileName);
    return tempFilePath;
  }
  
  // Fetch image data as a buffer from the URL
  async function fetchImageBuffer(imageUrl) {
    const response = await fetch(imageUrl);
    return Buffer.from(await response.arrayBuffer());
  }
  
  // Download image from Google Cloud Storage to a temporary path
  async function downloadImageFromGCS(bucketName, fileName) {
    const file = storage.bucket(bucketName).file(fileName);
    const tempFilePath = path.join('/tmp', fileName);
  
    await file.download({ destination: tempFilePath });
    console.log(`Downloaded ${fileName} to ${tempFilePath}`);
  
    return tempFilePath;
  }
  
  // Generate content using the uploaded image with Google AI
  async function generateContentFromImage(prompt, filePath) {
    const fileManager = new GoogleAIFileManager(process.env.API_KEY);
    const fileMetadata = { mimeType: 'image/jpeg', name: path.basename(filePath) };
  
    const uploadResult = await fileManager.uploadFile(filePath, fileMetadata);
    console.log(`Uploaded file ${uploadResult.file.name} as: ${uploadResult.file.uri}`);
  
    return model.generateContent([prompt, { fileData: { fileUri: uploadResult.file.uri, mimeType: uploadResult.file.mimeType } }]);
  }
