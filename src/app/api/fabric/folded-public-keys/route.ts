import {NextRequest, NextResponse} from "next/server";

export const revalidate = 0;
export async function GET(request: NextRequest) {

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
    const { token: authorizationToken } = await response.json();

    let fabricBody = JSON.stringify({
        "method": "KVContractGo:GetFoldedPublicKeys",
        "args":   [],
    });
    response = await fetch(`${process.env.NEXT_PUBLIC_FABRIC_URL}/query/vote-channel/SentinelVote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authorizationToken}`,
            "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching
            "Pragma": "no-cache", // For compatibility with HTTP/1.0
            "Expires": "0" // Proxies
        },
        body: fabricBody
    });

    const { response: foldedPublicKeys } = await response.json();

    const res = new NextResponse(JSON.stringify(foldedPublicKeys));
    res.headers.set('Content-Type', 'application/json');
    return res;
}
