import { NextRequest, NextResponse } from "next/server";
import { FabricAuthorizationToken } from "@/app/globals";

export const revalidate = 0;
export async function GET(request: NextRequest) {
  const res = new NextResponse(await FabricAuthorizationToken());
  res.headers.set('Content-Type', 'text/plain');
  return res;
}
