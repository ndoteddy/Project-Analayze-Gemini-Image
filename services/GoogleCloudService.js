// src/services/GoogleCloudService.js

const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const path = require('path');

class GoogleCloudService {
  constructor(projectId, databaseId, apiKey, bucketName) {
    this.firestore = new Firestore({ projectId, databaseId });
    this.storage = new Storage();
    this.apiKey = apiKey;
    this.bucketName = bucketName;
  }

  async  getImageMimeType(imageUrl) {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.headers.get('Content-Type') || 'image/jpeg'; // Default to 'image/jpeg'
  }
  
  // Firestore: Get or create a document
  async getOrCreateDocument(collectionName, docId, data) {
    const docRef = this.firestore.collection(collectionName).doc(docId);
    await docRef.set(data);
  }

  // Google Cloud Storage: Upload image
  async uploadImage(imageUrl, fileName, mimeType) {
    const buffer = await this.fetchImageBuffer(imageUrl);
    const file = this.storage.bucket(this.bucketName).file(fileName);
    await file.save(buffer, { metadata: { contentType: mimeType } });
    return this.downloadImage(fileName);
  }

  // Fetch image as a buffer
  async fetchImageBuffer(imageUrl) {
    const response = await fetch(imageUrl);
    return Buffer.from(await response.arrayBuffer());
  }

  // Download image from GCS
  async downloadImage(fileName) {
    const file = this.storage.bucket(this.bucketName).file(fileName);
    const tempFilePath = path.join('/tmp', fileName);
    await file.download({ destination: tempFilePath });
    return tempFilePath;
  }


}

module.exports = GoogleCloudService;
