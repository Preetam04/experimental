import { instaScrape } from "@/utils/socialScrape";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    throw new Error("Please provide a url");
  }

  const data = await instaScrape(url);

  //   console.log(data)

  return NextResponse.json(
    {
      message: "data fetched",
      data,
    },
    {
      status: 200,
    }
  );
}
