import { analyzeImage } from "@/utils/imageUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Content type must be multipart/form-data" },
      { status: 400 }
    );
  }
  const formData = await req.formData();
  const image = formData.get("image") as File;

  console.log(image);

  //   console.log(image);
  const data = await analyzeImage(image);

  // console.log(data);

  return NextResponse.json({
    message: "image parsed",
    data,
  });
}
