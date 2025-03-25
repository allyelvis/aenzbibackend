import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, setupPin } from "@/lib/auth-service"

export async function POST(req: NextRequest) {
  try {
    // Get current user
    const currentUser = await getCurrentUser(req)

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await req.json()
    const { pin } = body

    if (!pin) {
      return NextResponse.json({ error: "PIN is required" }, { status: 400 })
    }

    // Set up PIN for user
    const { success, error } = await setupPin(currentUser.id, pin, req)

    if (!success) {
      return NextResponse.json({ error: error || "Failed to set up PIN" }, { status: 500 })
    }

    // Return updated user
    return NextResponse.json({
      success: true,
      user: {
        ...currentUser,
        hasPin: true,
      },
    })
  } catch (error) {
    console.error("Setup PIN error:", error)
    return NextResponse.json({ error: "Failed to set up PIN" }, { status: 500 })
  }
}

