import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, getUserActivityLogs } from "@/lib/auth-service"

export async function GET(req: NextRequest) {
  try {
    // Get current user
    const currentUser = await getCurrentUser(req)

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

    // Get activity logs
    const { logs, count, error } = await getUserActivityLogs(currentUser.id, limit, offset)

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ logs, count })
  } catch (error) {
    console.error("Get activity logs error:", error)
    return NextResponse.json({ error: "Failed to get activity logs" }, { status: 500 })
  }
}

