"use client"
import { signIn, signOut, useSession } from "next-auth/react"

export function LoginButton() {
    const { data: session } = useSession()

    if (session) {
        return <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => signOut()}>Sign out</button>
    }
    return <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => signIn("spotify")}>Sign in with Spotify</button>


}