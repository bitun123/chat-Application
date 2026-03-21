import { ChatMistralAI } from "@langchain/mistralai";
import { AIMessage, HumanMessage, SystemMessage, tool, createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";


const mistralAgentModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
  streaming: false, //0,
});

const mistralTitleModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});



const searchInternetTool = tool(
  searchInternet,
  {
    name: "searchInternet",
    description: "Use this tool to get the latest information from the internet.",
    schema: z.object({
      query: z.string().describe("The search query string. For example: 'What is the capital of France?'"),
    }),
  }
);

const agent = createAgent({
  model: mistralAgentModel,
  tools: [searchInternetTool],
});



const SYSTEM_PROMPT = `
You are a helpful assistant.
IMPORTANT:
- If the question needs current or real-time information, you MUST use the "searchInternet" tool.
- Do NOT answer from your own knowledge in such cases.
- Always call the tool first, then respond based on its result.
- Keep responses SHORT and CONCISE — maximum 3-5 lines.
- No long tables, no extra explanation.
- Only give the most important information.
`;



const formatMessages = (messages) =>
  messages.map((msg) => {
    if (msg.role === "user") return new HumanMessage(msg.content);
    if (msg.role === "ai") return new AIMessage(msg.content);
    return new HumanMessage(msg.content);
  });


export async function generateGroqResponse(messages) {
  const response = await agent.invoke({
    messages: [new SystemMessage(SYSTEM_PROMPT), ...formatMessages(messages)],
  });

  const lastMessage = response.messages[response.messages.length - 1];
  return lastMessage.text || lastMessage.content || "";
}



export async function generateGroqResponseStream(messages, onToken) {

  const response = await agent.invoke({
    messages: [new SystemMessage(SYSTEM_PROMPT), ...formatMessages(messages)],
  });


  const lastMessage = response.messages[response.messages.length - 1];
  const fullContent = lastMessage.text || lastMessage.content || "";


  const words = fullContent.split(" ");
  for (const word of words) {
    onToken(word + " ");
    await new Promise((res) => setTimeout(res, 20));
  }

  return fullContent;
}



export async function generateMistralChatTitle(message) {
  const response = await mistralTitleModel.invoke([
    new SystemMessage(`You are a helpful assistant that generates concise titles for chat conversations.
      Rules:
      - Title should be 2-4 words only
      - Use Title Case (capitalize first letter of each major word)
      - No special characters or punctuation
      - Be descriptive and relevant to the topic
    `),
    new HumanMessage(`Generate a concise title for this first message: ${message}`),
  ]);

  return response.text;
}