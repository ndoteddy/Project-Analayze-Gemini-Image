class GeminiContent {
    constructor(text) {
      this.text = text;
    }
  }
  
  class GeminiCandidate {
    constructor(content, finishReason, avgLogprobs) {
      this.content = content;
      this.finishReason = finishReason;
      this.avgLogprobs = avgLogprobs;
    }
  
    // Static method to create a GeminiCandidate instance from a plain JSON object
    static fromJSON(json) {
      const content = json.content.parts.map(part => new GeminiContent(part.text));
      return new GeminiCandidate(content, json.finishReason, json.avgLogprobs);
    }
  }
  
  class GeminiResponse {
    constructor(candidates, usageMetadata, modelVersion) {
      this.candidates = candidates;
      this.usageMetadata = usageMetadata;
      this.modelVersion = modelVersion;
    }
  
    // Static method to create a GeminiResponse instance from a plain JSON object
    static fromJSON(json) {
      const candidates = json.candidates.map(candidate => GeminiCandidate.fromJSON(candidate));
      return new GeminiResponse(candidates, json.usageMetadata, json.modelVersion);
    }
  }
  
  class GeminiAnalysis {
    constructor(response) {
      this.response = response;
    }
  
    // Method to get all text descriptions
    getContentText() {
      return this.response.candidates
      .map(candidate => 
        candidate.content
          .map(content => content.text)  // Get all text values in the content array
          .join(" ")  // Join them into a single string with a space separating them
      )
      .join(" ");  // Join all candidate text into one string, with a space between candidates
    }
  
    // Method to get token counts
    getTokenCounts() {
      const metadata = this.response.usageMetadata;
      return {
        promptTokenCount: metadata.promptTokenCount,
        candidatesTokenCount: metadata.candidatesTokenCount,
        totalTokenCount: metadata.totalTokenCount,
      };
    }
  }
  


module.exports = {
  GeminiResponse,
  GeminiAnalysis
};