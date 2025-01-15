import axios from "axios";
import * as cheerio from "cheerio";
import TurndownService from "turndown";

export async function HTMLParser(link: string) {
  const turndownService = new TurndownService();
  //   const loaded = new CheerioWebBaseLoader(link, {
  //     selector: "h1,h2,h3,h4, p, img",
  //   });

  turndownService.addRule("imageAltText", {
    filter: "img",
    replacement: (content, node) => {
      const src = node?.getAttribute("src") || "";
      const alt = node?.getAttribute("alt") || "image";
      return `![${alt}](${src})`;
    },
  });

  //   const data = await loaded.sca();
  const { data: html } = await axios.get(link, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  const $ = cheerio.load(html);

  const elements = $("h1, h2, h3, h4, h5, h6, p, li, img");

  let extractedHTML = "";
  elements.each((_, element) => {
    extractedHTML += $.html(element) + "\n";
  });

  return turndownService.turndown(extractedHTML);
}

export async function chunkMD(text: string, maxChunkSize = 2000) {
  try {
    // Read the Markdown file

    const markdown = text;

    // Split the Markdown into lines
    const lines = markdown.split("\n");

    // console.log(lines);

    // Chunk the lines into groups
    const chunks: string[] = [];
    let currentChunk = "";

    lines.forEach((line) => {
      // Check if adding this line exceeds the max chunk size
      if (currentChunk.length + line.length + 1 > maxChunkSize) {
        chunks.push(currentChunk.trim()); // Save the current chunk

        currentChunk = ""; // Reset the chunk
      }

      currentChunk += line + "\n"; // Add the line to the current chunk
    });

    // Add any remaining content as the last chunk
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    // Save chunks to separate files

    return chunks;
  } catch (error) {
    console.error(`Error chunking the Markdown file: ${error?.message ?? ""}`);
  }
}
