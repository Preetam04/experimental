import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { cleanText } from "./llm";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { DocumentInterface } from "@langchain/core/documents";
import axios from "axios";

interface FileInput {
  content: Buffer;
  name: string;
}

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1200,
  chunkOverlap: 300,
});

export const markdownSplitter = RecursiveCharacterTextSplitter.fromLanguage(
  "markdown",
  {
    chunkSize: 1200,
    chunkOverlap: 300,
  }
);

class FileConverter {
  async processFile(file: File): Promise<DocumentInterface[] | unknown> {
    const extension = file.name.toLowerCase().split(".").pop();

    console.log(extension);

    try {
      switch (extension) {
        case "pdf":
          return await this.processPDF(file);
        case "txt":
          return await this.processTxt(file);
        case "docx":
          return await this.processDocx(file);
        case "jpeg":
          return await this.processImages(file);
        default:
          throw new Error(`Unsupported file type: ${extension}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Error converting file ${file.name}: ${errorMessage}`);
    }
  }

  private async processPDF(file: File): Promise<DocumentInterface[]> {
    // Get the PDF Name
    // Make sure the pdf is uploaded to the cloud or the parsing won't work
    // Provide the pdf link to the jina.ai to covert the the pdf data in markdown format
    // also taking it over there make sure you get the upload ID to access the PDF

    const name = file.name;
    const uploadId = "9935037e-f481-4c8f-bb25-8dde34b9139c";

    const fileUrl = `https://storage.museyard.com/uploads/${uploadId}/${name}`;

    const response = await axios.get(`https://r.jina.ai/${fileUrl}`, {
      headers: {
        Authorization: `Bearer ${process.env.JINA_API_KEY}`,
      },
    });

    const chunks = await markdownSplitter.createDocuments([response.data]);

    // console.log(response.data);

    return chunks;
  }
  private async processTxt(file: File): Promise<DocumentInterface[]> {
    // console.log(file);
    const loader = new TextLoader(file);

    const content = await loader.load();

    // console.log(content[0].pageContent);

    const cleanedText = cleanText(content[0].pageContent).replaceAll("\n", " ");

    const chunks = await splitter.createDocuments([cleanedText]);

    console.log(chunks);

    return chunks;
  }

  private async processDocx(file: File): Promise<DocumentInterface[]> {
    const loader = new DocxLoader(file);

    const docs = await loader.load();

    const chunks = await splitter.createDocuments([docs[0].pageContent]);

    // console.log(chunks);

    return chunks;
  }

  private async processImages(file: File) {
    console.log(file);

    return " ";
  }

  private structureContent(text: string): string {
    return "";
  }
}

export async function processFiles(file: File) {
  // console.log(file);

  const converter = new FileConverter();
  const result = await converter.processFile(file);
  return result;
}
