// src/controllers/ImageController.js

const GoogleCloudService = require('../services/GoogleCloudService');
const ImageAnalyzer = require('../services/ImageAnalyzer');
const { GeminiResponse, GeminiAnalysis } = require('../models/GeminiResponse');
const { v4: uuidv4 } = require('uuid');
class ImageController {
  constructor(apiKey, projectId, databaseId, bucketName, collectionName) {
    this.googleCloudService = new GoogleCloudService(
      projectId,
      databaseId,
      apiKey,
      bucketName
    );
    this.imageAnalyzer = new ImageAnalyzer(apiKey);
    this.collectionName = collectionName;
  }

  // Main endpoint to analyze image
  async analyzeImage(req, res) {
    try {
      const { prompt, imageUrl, maxOutputTokens, temperature } = req.body;

      // Upload image and fetch mime type
      const mimeType = await this.googleCloudService.getImageMimeType(imageUrl);
      const fileName = uuidv4();
      const tempFilePath = await this.googleCloudService.uploadImage(
        imageUrl,
        fileName,
        mimeType
      );

      // Get model config and analyze image
      const modelConfig = this.imageAnalyzer.getModelConfig(maxOutputTokens, temperature);
      const model = this.imageAnalyzer.genAI.getGenerativeModel(modelConfig);

  

      const result = await this.imageAnalyzer.analyzeImage(model, prompt, tempFilePath);

      // Parse response and save to Firestore
      const geminiResponse = GeminiResponse.fromJSON(result);
      const geminiAnalysis = new GeminiAnalysis(geminiResponse);
      const contentText = geminiAnalysis.getContentText();

      const data = {
        name: fileName,
        result: contentText,
        tokenCount: geminiAnalysis.getTokenCounts(),
        bucketName: process.env.GCS_BUCKET_NAME,
      };

      await this.googleCloudService.getOrCreateDocument(
        this.collectionName,
        fileName,
        data
      );

      res.status(200).send(data);
    } catch (error) {
      console.error('Error analyzing image:', error);
      res.status(500).json({ error: 'Error analyzing image>>' + error.stack});
    }
  }
}

module.exports = ImageController;
