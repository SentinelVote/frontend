import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;
export async function GET(request: NextRequest) {
  const res = new NextResponse(await AuthorizationToken());
  res.headers.set('Content-Type', 'text/plain');
  return res;
}

export async function AuthorizationToken() {
  try {
    let response = await fetch(`${process.env.NEXT_PUBLIC_FABRIC_URL}/user/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer",
        "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
        "Pragma": "no-cache", // For compatibility with HTTP/1.0
        "Expires": "0" // Proxies
      },
      body: JSON.stringify({
        id: "admin",
        secret: "adminpw",
      }),
    });
    const responseJSON = await response.json();
    return responseJSON.token;
  } catch (e) {
    console.log(e);
    return "00000000-0000-0000-0000-000000000000-admin";
  }
}
