import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

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

export async function chunkText(text: string) {
  const zodSchema = z.object({
    chunks: z
      .array(
        z.string().describe("chunk of related information provided content")
      )
      .describe("array of chunks"),
    tags: z
      .array(z.string().describe("relevant tags from the extracted content"))
      .describe("array of tags"),
  });

  const parser = StructuredOutputParser.fromZodSchema(zodSchema);

  const chain = RunnableSequence.from([
    ChatPromptTemplate.fromTemplate(
      "You are an expert text analyzer who can take any text, analytze it, and create multiple facts from it.\n{format_instructions}\n{input}"
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
