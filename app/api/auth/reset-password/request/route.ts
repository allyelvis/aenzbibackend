import { type NextRequest, NextResponse } from "next/server"
import { requestPasswordReset } from "@/lib/auth-service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Request password reset
    const { success, error } = await requestPasswordReset(email)

    if (!success) {
      return NextResponse.json({ error: error || "Failed to request password reset" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json({ error: "Failed to request password reset" }, { status: 500 })
  }
}

