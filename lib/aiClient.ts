import OpenAI from "openai";

export const aiClient = new OpenAI({
  baseURL: "https://litellm.rapidscreen.io/v1",
  apiKey: process.env.KRACKEDDEVS_API_KEY,
  maxRetries: 0,
});
