// src/services/ImageAnalyzer.js

const { GoogleGenerativeAI, GenerationConfig } = require('@google/generative-ai');
const { GoogleAIFileManager } =  require("@google/generative-ai/server");
const path = require('path');
const apiKey="";
class ImageAnalyzer {
  constructor(apiKey) {
    this.apiKey=apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

    // Upload file to Gemini
    async uploadToGemini(filePath) {
      console.log(this.apiKey);
      const fileManager = new GoogleAIFileManager(this.apiKey);
      const fileMetadata = { mimeType: 'image/jpeg', name: path.basename(filePath) };
      const uploadResult = await fileManager.uploadFile(filePath, fileMetadata);
      return uploadResult;
    }

  // Generate content using the uploaded image with Gemini AI
  async analyzeImage(model, prompt, filePath) {
  
    const uploadResult = await this.uploadToGemini(filePath);
    console.log(uploadResult);
    const result = await model.generateContent([prompt, { fileData: { fileUri: uploadResult.file.uri, mimeType: uploadResult.file.mimeType } }]);
    return result.response;
  }

  // Get model configuration
  getModelConfig(maxOutputTokens, temperature) {
    return {
      model: 'gemini-1.5-flash',
      generationConfig: {
        candidateCount: 1,
        maxOutputTokens: maxOutputTokens,
        temperature: temperature,
      }
    };
  }
}

module.exports = ImageAnalyzer;
