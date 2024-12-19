import { getServerSession } from "next-auth"
import { NextResponse } from 'next/server'
import { authOptions } from "./auth/[...nextauth]/options"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401
        })
    }

    console.log('GET API', session)
    return NextResponse.json({ authenticated: !!session })
}
