import { NextRequest, NextResponse } from "next/server";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { chunkText } from "@/utils/llm";

export async function POST(req: NextRequest) {
  if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Content type must be multipart/form-data" },
      { status: 400 }
    );
  }
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const loader = new TextLoader(file);

  const content = await loader.load();

  //   console.log(content[0].pageContent);

  const chunks = await chunkText(content[0].pageContent);

  console.log(chunks.chunks);

  //   const hContent = await loader.load();

  //   console.log(hContent[0].pageContent);

  return NextResponse.json({
    message: "txt parsed",
    chunks,
  });
}
