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
        "method": "KVContractGo:GetVotes",
        "args":   [],
      }),
    });
    const responseJSON = await response.json();
    return NextResponse.json(responseJSON.response);
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      "countCandidate": {},
      "countConstituency": {},
      "countHour": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "countTotal": 0,
      "raw": null
    });
  }
}
