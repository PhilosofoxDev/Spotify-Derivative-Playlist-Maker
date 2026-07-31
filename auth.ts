import NextAuth from "next-auth"
import Spotify from "next-auth/providers/spotify"

import type { JWT } from "next-auth/jwt"

const SPOTIFY_SCOPES = [
    "user-read-email",
    "user-read-private",
    "user-top-read",
    "user-read-currently-playing",
    "user-read-playback-state",
    "playlist-read-private",
].join(" ")



const spotifyClientId = process.env.SPOTIFY_CLIENT_ID
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET

if (!spotifyClientId || !spotifyClientSecret) {
    throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env.local")
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Spotify({
            clientId: spotifyClientId,
            clientSecret: spotifyClientSecret,
            authorization: `https://accounts.spotify.com/authorize?scope=${SPOTIFY_SCOPES}`,
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    expiresAt: account.expires_at! * 1000,
                }
            }
            if (Date.now() < (token.expiresAt as number)) {
                return token
            }
            return refreshSpotifyToken(token)
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string
            session.error = token.error as string | undefined
            return session
        },
    },
})

async function refreshSpotifyToken(token: JWT) {
    try {
        const res = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " +
                    Buffer.from(
                        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                    ).toString("base64"),
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: token.refreshToken!,
            }),
        })
        const refreshed = await res.json()
        if (!res.ok) throw refreshed
        return {
            ...token,
            accessToken: refreshed.access_token,
            expiresAt: Date.now() + refreshed.expires_in * 1000,
            refreshToken: refreshed.refresh_token ?? token.refreshToken,
        }
    } catch (err) {
        console.error("Error refreshing Spotify token", err)
        return { ...token, error: "RefreshTokenError" }
    }
}