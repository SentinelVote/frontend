import {NextRequest, NextResponse} from "next/server";

interface Vote {
    constituency: string;
    signature: string;
    vote: string;
}

export const revalidate = 0;
export async function GET(request: NextRequest) {
    
    let response = await fetch(`http://localhost:8801/user/enroll`, {
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
        "method": "KVContractGo:GetVotes",
        "args":   [],
    });
    response = await fetch(`http://localhost:8801/query/vote-channel/SentinelVote`, {
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

    const { response: votes } = await response.json();
    
    const res = new NextResponse(JSON.stringify(votes));
    res.headers.set('Content-Type', 'application/json');
    return res;
}
