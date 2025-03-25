import { type NextRequest, NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import { generateToken, handleGoogleCallback, setAuthCookie } from "@/lib/auth-service"
import { validateEnv } from "@/lib/env"

const { GOOGLE_CLIENT_ID } = validateEnv()

const client = new OAuth2Client(GOOGLE_CLIENT_ID)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: "Google token is required" }, { status: 400 })
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid Google token" }, { status: 401 })
    }

    // Handle Google authentication
    const googleUser = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    }

    const user = await handleGoogleCallback(googleUser)

    if (!user) {
      return NextResponse.json({ error: "Failed to authenticate with Google" }, { status: 500 })
    }

    // Generate token
    const jwtToken = await generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      authMethod: "google",
    })

    // Set cookie
    setAuthCookie(jwtToken)

    // Return user info
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        hasPin: user.hasPin,
        picture: googleUser.picture,
      },
    })
  } catch (error) {
    console.error("Google login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

