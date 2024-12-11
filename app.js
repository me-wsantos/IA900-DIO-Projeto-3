"use strict";

const { TextAnalysisClient, AzureKeyCredential } = require("@azure/ai-language-text");

require("dotenv").config();

const key = process.env.LANGUAGE_KEY;
const endpoint = process.env.LANGUAGE_ENDPOINT;

const documents = [{
    text: "Ótima localização e café da manhã delicioso. A equipe foi sempre muito atenciosa e prestativa. Recomendo este hotel!",
    id: "0",
    language: "pt-Br"
  }];
  
async function main() {
  console.log("=== Sentiment analysis and opinion mining sample ===");

  const credential = new AzureKeyCredential(key);
  const client = new TextAnalysisClient(endpoint, credential);

  const results = await client.analyze("SentimentAnalysis", documents, {
    includeOpinionMining: true,
  });

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    console.log(`- Document ${result.id}`);
    if (!result.error) {
      console.log(`\tDocument text: ${documents[i].text}`);
      console.log(`\tOverall Sentiment: ${result.sentiment}`);
      console.log("\tSentiment confidence scores:", result.confidenceScores);
      console.log("\tSentences");
      for (const { sentiment, confidenceScores, opinions } of result.sentences) {
        console.log(`\t- Sentence sentiment: ${sentiment}`);
        console.log("\t  Confidence scores:", confidenceScores);
        console.log("\t  Mined opinions");
        for (const { target, assessments } of opinions) {
          console.log(`\t\t- Target text: ${target.text}`);
          console.log(`\t\t  Target sentiment: ${target.sentiment}`);
          console.log("\t\t  Target confidence scores:", target.confidenceScores);
          console.log("\t\t  Target assessments");
          for (const { text, sentiment } of assessments) {
            console.log(`\t\t\t- Text: ${text}`);
            console.log(`\t\t\t  Sentiment: ${sentiment}`);
          }
        }
      }
    } else {
      console.error(`\tError: ${result.error}`);
    }
  }
}
  
main().catch((err) => {
  console.error("The sample encountered an error:", err);
});