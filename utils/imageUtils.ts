import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { Jimp } from "jimp";
import Tesseract from "tesseract.js";

import { generateObject, generateText } from "ai";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const openAI = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeImage(file: File, textRatioThreshold = 0.0003) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const image = await Jimp.read(buffer);
  const imageArea = image.bitmap.width * image.bitmap.height;

  const recognizedLanguage = "eng+hin";

  const {
    data: { text },
  } = await Tesseract.recognize(buffer, recognizedLanguage, {
    cacheMethod: "none",
  });

  //   Calculate text density
  const textLength = text.trim().length;
  const textDensity = textLength / imageArea;
  // console.log(textDensity);

  if (textDensity > textRatioThreshold) {
    // TODO: Make it todo single llm call
    const response2 = await generateObject({
      model: openAI("gpt-4o-mini"),
      schema: z.string(),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "For the given text please fix the punctuation error if there are any and return it",
            },
            {
              type: "text",
              text: `${text}`,
            },
          ],
        },
      ],
    });

    return response2.object;
  } else {
    const base64Image = buffer.toString("base64");
    const response = await generateText({
      model: google("gemini-1.5-flash-latest"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please summarize the given image in 5-6 lines",
            },
            {
              type: "image",
              image: `data:image/png;base64,${base64Image}`,
            },
          ],
        },
      ],
    });

    // console.log(response.text);
    return response.text;
  }

  // return textDensity > textRatioThreshold;
}
