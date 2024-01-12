import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
    // Get the header's content type and set it as the response's content type
    if (request.headers.get('Content-Type') !== 'text/plain') {
        const res = new NextResponse("pong");
        res.headers.set('Content-Type', 'text/plain');
        return res;
    } else {
        return NextResponse.json({
            message: "pong"
        });
    }
}
