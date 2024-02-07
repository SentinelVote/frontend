import { NextRequest, NextResponse } from "next/server";
import { FabricAuthorizationToken } from "@/app/globals";

export const revalidate = 0;
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FABRIC_URL}/query/vote-channel/SentinelVote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${await FabricAuthorizationToken()}`,
        "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
        "Pragma": "no-cache", // For compatibility with HTTP/1.0
        "Expires": "0" // Proxies
      },
      body: JSON.stringify({
        "method": "KVContractGo:GetFoldedPublicKeys",
        "args":   [],
      }),
    });
    const responseJSON = await response.json();
    const res = new NextResponse(responseJSON.response);
    res.headers.set('Content-Type', 'text/plain');
    return res;
  } catch (e) {
    console.log(e);
    const res = new NextResponse("Missing/Unset");
    res.headers.set('Content-Type', 'text/plain');
    return res;
  }
}
