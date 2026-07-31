import { auth } from "@/auth"

export async function GET() {
    const session = await auth()
    if (!session?.accessToken) {
        return new Response("Unauthorized", { status: 401 })
    }

    const res = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    })

    return Response.json(await res.json())
}