import { type NextRequest, NextResponse } from "next/server"
import { loginUser, generateToken, setAuthCookie } from "@/lib/auth-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // Attempt login
    const result = await loginUser(email, password)

    if (!result.success || !result.user) {
      return NextResponse.json({ success: false, message: result.message }, { status: 401 })
    }

    // Generate JWT token
    const token = await generateToken(result.user as any)

    // Set auth cookie
    setAuthCookie("auth_token", token)

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
        role: result.user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)

    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}

