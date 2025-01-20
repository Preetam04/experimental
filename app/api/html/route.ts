import { chunkMD, HTMLParser } from "@/utils/htmlParser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { link } = await req.json();
  // this things converts important elements of html pages to markdown and then chunks it down
  console.log(link);

  const parsedHtml = await HTMLParser(link);
  console.log(parsedHtml);

  const chunks = await chunkMD(parsedHtml, 1000);

  console.log(chunks);

  return NextResponse.json({
    message: "Html parsed",
    chunks,
  });
}
