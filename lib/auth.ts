import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { env } from "@/lib/env"
import { hash, compare } from "bcrypt"
import logger from "@/lib/logger"

// Secret key for JWT
const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET)

// Token expiration time
const TOKEN_EXPIRATION = "8h"

// Cookie name
export const AUTH_COOKIE = "aenzbi_auth_token"

// User interface
export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

// Generate JWT token
export async function generateToken(user: AuthUser): Promise<string> {
  try {
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(TOKEN_EXPIRATION)
      .sign(JWT_SECRET)

    return token
  } catch (error) {
    logger.error({ error }, "Failed to generate JWT token")
    throw new Error("Authentication failed")
  }
}

// Verify JWT token
export async function verifyToken(token: string): Promise<AuthUser> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    }
  } catch (error) {
    logger.error({ error }, "Failed to verify JWT token")
    throw new Error("Invalid token")
  }
}

// Get current user from request
export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get(AUTH_COOKIE)?.value

    if (!token) {
      return null
    }

    return await verifyToken(token)
  } catch (error) {
    logger.error({ error }, "Failed to get current user")
    return null
  }
}

// Protect route middleware
export async function protectRoute(request: NextRequest) {
  const user = await getCurrentUser(request)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return null
}

// Role-based access control
export async function requireRole(request: NextRequest, allowedRoles: string[]) {
  const user = await getCurrentUser(request)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return null
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

// Login user
export async function loginUser(email: string, password: string): Promise<{ user: AuthUser; token: string } | null> {
  try {
    // Find user by email
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (userResult.length === 0) {
      return null
    }

    const user = userResult[0]

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash)

    if (!isPasswordValid) {
      return null
    }

    // Update last login
    await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, user.id))

    // Generate token
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    const token = await generateToken(authUser)

    return { user: authUser, token }
  } catch (error) {
    logger.error({ error }, "Login failed")
    return null
  }
}

// Set auth cookie
export function setAuthCookie(token: string) {
  cookies().set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, // 8 hours
    sameSite: "lax",
  })
}

// Clear auth cookie
export function clearAuthCookie() {
  cookies().delete(AUTH_COOKIE)
}

// Get auth cookie
export function getAuthCookie(): string | undefined {
  return cookies().get(AUTH_COOKIE)?.value
}

