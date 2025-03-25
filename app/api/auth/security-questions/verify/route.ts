import { type NextRequest, NextResponse } from "next/server"
import { verifySecurityQuestions } from "@/lib/auth-service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, answers } = body

    if (!userId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "User ID and answers are required" }, { status: 400 })
    }

    // Verify security questions
    const { success, error } = await verifySecurityQuestions(userId, answers)

    if (!success) {
      return NextResponse.json({ error: error || "Verification failed" }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Verify security questions error:", error)
    return NextResponse.json({ error: "Failed to verify security questions" }, { status: 500 })
  }
}

