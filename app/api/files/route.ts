import { processFiles } from "@/utils/document-converter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content type must be multipart/form-data" },
        { status: 400 }
      );
    }
    const formData = await req.formData();
    const file = formData.get("file") as File;

    const data = await processFiles(file);

    return NextResponse.json(
      {
        message: "File Uploaded",
        data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Error uploading files",
      },
      {
        status: 500,
      }
    );
  }
}
