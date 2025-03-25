import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, setupSecurityQuestions } from "@/lib/auth-service"

export async function POST(req: NextRequest) {
  try {
    // Get current user
    const currentUser = await getCurrentUser(req)

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await req.json()
    const { questions } = body

    if (!questions || !Array.isArray(questions) || questions.length < 3) {
      return NextResponse.json({ error: "At least 3 security questions are required" }, { status: 400 })
    }

    // Set up security questions
    const { success, error } = await setupSecurityQuestions(currentUser.id, questions, req)

    if (!success) {
      return NextResponse.json({ error: error || "Failed to set up security questions" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Setup security questions error:", error)
    return NextResponse.json({ error: "Failed to set up security questions" }, { status: 500 })
  }
}

