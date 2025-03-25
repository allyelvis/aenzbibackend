import { type NextRequest, NextResponse } from "next/server"
import { authenticateWithPin } from "@/lib/auth-service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, pin } = body

    if (!email || !pin) {
      return NextResponse.json({ error: "Email and PIN are required" }, { status: 400 })
    }

    // Authenticate user with PIN
    const { user, error } = await authenticateWithPin(email, pin, req)

    if (error || !user) {
      return NextResponse.json({ error: error || "Authentication failed" }, { status: 401 })
    }

    // Return user info
    return NextResponse.json({ user })
  } catch (error) {
    console.error("PIN login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

