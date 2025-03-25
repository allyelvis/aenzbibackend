import { type NextRequest, NextResponse } from "next/server"
import { logout, getCurrentUser } from "@/lib/auth-service"

export async function POST(req: NextRequest) {
  try {
    // Get current user for activity logging
    const user = await getCurrentUser(req)

    // Logout from Supabase
    const { success, error } = await logout(user?.id, req)

    if (!success) {
      return NextResponse.json({ error: error || "Logout failed" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}

