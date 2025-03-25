import { type NextRequest, NextResponse } from "next/server"
import { resetPassword } from "@/lib/auth-service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { password } = body

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    // Reset password
    const { success, error } = await resetPassword(password)

    if (!success) {
      return NextResponse.json({ error: error || "Failed to reset password" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}

