import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
  maxOutputTokens: 2048,
  temperature: 0,
});

// export async function chunkText(text: string) {
//   const prompt = ChatPromptTemplate.fromMessages([
//     [
//       "system",
//       "I am an expert text analyzer. Given any input text, I will:Analyze and divide it into meaningful chunks that preserve the context and relationships within the data. Extract relevant tags that provide an overview of the content, categorizing its key themes and topics. Ensure that the extracted chunks and tags encompass all the links, key pieces of information, and outputs within the text. The goal is to create a structured and well-organized representation of the data.",
//     ],
//     ["human", "{input}"],
//   ]);

//   //   const schema = z.object({
//   //     chunks: z
//   //       .array(z.string().describe("chunk of relevant content"))
//   //       .describe("the array of the chunks"),
//   //     tags: z
//   //       .array(z.string().describe("relevant tag"))
//   //       .describe("array of the tags"),
//   //   });

//   const parser = StructuredOutputParser.fromZodSchema(
//     z.object({
//       chunks: z
//         .array(z.string().describe("chunk of relevant content"))
//         .describe("the array of the chunks"),
//       tags: z
//         .array(z.string().describe("relevant tag"))
//         .describe("array of the tags"),
//     })
//   );

//   const chain = prompt.pipe(model).pipe(parser);

//   const response = await chain.invoke({
//     input: text,
//   });

//   return response;
// }

const FILTERED_PATTERNS = [
  // WhatsApp patterns
  /Messages and calls are end-to-end encrypted\./i,
  /\d{2}\/\d{2}\/\d{4},\s\d{1,2}:\d{2}\s(?:AM|PM)\s-/g, // Date/time stamps
  /\[\d{1,2}:\d{2}\s(?:AM|PM)\]/g,

  // OTP patterns
  /your\s+OTP\s+is\s+\d+/i,
  /verification\s+code\s+is\s+\d+/i,
  /\b\d{4,6}\b\s+is\s+your\s+(?:verification|access)\s+code/i,

  // Common message footers
  /This\s+message\s+was\s+deleted\b/i,
  /This\s+is\s+an\s+automated\s+message/i,
  /Do\s+not\s+share\s+this\s+(?:OTP|code)/i,

  // System messages
  /\<Media\s+omitted\>/i,
  /\bJoined\s+using\s+invite\s+link\b/i,
  /\bChanged\s+(?:this)?\s*group's\s+(?:icon|description|settings)\b/i,
  /\[\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2}(:\d{2})? (AM|PM)\] you:/g,
];

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 700,
  chunkOverlap: 250,
});
export function cleanText(text: string): string {
  let cleaned = text;

  // Remove filtered patterns
  FILTERED_PATTERNS.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, "");
  });

  // Remove extra whitespace and empty lines
  cleaned = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");

  return cleaned;
}

export async function chunkText(text: string) {
  const cleanedText = cleanText(text);

  const chunks = await splitter.createDocuments([cleanedText]);

  return chunks;
}

export async function chunkHtml(text: string) {
  const zodSchema = z.object({
    chunks: z
      .array(
        z.string().describe("chunk of related information provided content")
      )
      .describe("array of chunks"),
  });

  const parser = StructuredOutputParser.fromZodSchema(zodSchema);

  const chain = RunnableSequence.from([
    ChatPromptTemplate.fromTemplate(
      "You are an expert text analyzer who has give text that been extracted from and html, analytze it, and create multiple chunks from it.analyze based on hierarchy of heading and chunks such a that heading and its related content are together \n{format_instructions}\n{input}"
    ),
    model,
    parser,
  ]);

  const response = await chain.invoke({
    input: text,
    format_instructions: parser.getFormatInstructions(),
  });

  console.log(response);

  return response;
}
