import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    throw new Error("Url required");
  }

  const data = await axios.get(`http://r.jina.ai/${url}`);

  return NextResponse.json(
    {
      data: data.data,
      mesage: "helososd",
    },
    { status: 200 }
  );
}
