const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 0.3,
    topP: 0.8,
    topK: 20,
    maxOutputTokens: 200,
    responseMimeType: "text/plain",
  };

    export const chatSession = model.startChat({
      generationConfig,
      history: [
      ],
    });