import { NextRequest, NextResponse } from "next/server";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { chunkText } from "@/utils/llm";
import { pdfParser } from "@/utils/adbPdfParser";
import { chunkMD } from "@/utils/htmlParser";

export async function POST(req: NextRequest) {
  if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Content type must be multipart/form-data" },
      { status: 400 }
    );
  }
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const content = await pdfParser(file);
  //   console.log(chunks.chunks);

  //   console.log(content);

  if (!content)
    return NextResponse.json({
      message: "Something went wrong",
    });

  console.log(content);

  const chunks = await chunkMD(content, 1000);
  //   console.log(chunks);

  return NextResponse.json({
    message: "txt parsed",
    chunks,
  });
}
