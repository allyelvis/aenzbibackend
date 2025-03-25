import type { NextRequest } from "next/server"
import * as bcrypt from "bcryptjs"
import { createServerClient } from "@supabase/ssr"
import { supabase as supabaseClient, mapUserToProfile, type UserProfile } from "./supabase/client"
import { env } from "./env"
import { createClient } from "@supabase/supabase-js"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerClient as createServerClientAlias } from "@/lib/supabase/client"
import { SignJWT, jwtVerify } from "jose"
import { createAdminClient } from "@/lib/supabase/client"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const TOKEN_EXPIRY = "7d" // Token expires in 7 days

export interface UserData {
  id: string
  email: string
  role: string
  name?: string
}

export interface TokenPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

// User roles
export type UserRole = "admin" | "manager" | "user"

// Auth methods
export type AuthMethod = "password" | "pin" | "otp"

// Activity log types
export type ActivityAction =
  | "login"
  | "logout"
  | "failed_login"
  | "password_reset"
  | "profile_update"
  | "pin_setup"
  | "pin_update"
  | "account_locked"
  | "account_unlocked"
  | "two_factor_setup"
  | "two_factor_disabled"

// Initialize Supabase client
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create server client (for server components)
export function createServerSupabaseClient(cookieStore?: any) {
  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (name) => {
        return cookieStore?.get(name)?.value
      },
      set: (name, value, options) => {
        if (cookieStore) {
          cookieStore.set({ name, value, ...options })
        }
      },
      remove: (name, options) => {
        if (cookieStore) {
          cookieStore.set({ name, value: "", ...options })
        }
      },
    },
  })
}

// Create Supabase client for admin operations (using service role key)
const supabaseAdminClient = createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

/**
 * Generate a JWT token for the user
 */
// export function generateToken(user: any) {
//   return jwt.sign(
//     {
//       sub: user.id,
//       email: user.email,
//       role: user.role || "user",
//       iat: Math.floor(Date.now() / 1000),
//     },
//     JWT_SECRET,
//     { expiresIn: TOKEN_EXPIRY },
//   )
// }

// JWT token generation
// export async function generateTokenAlias(user: User): Promise<string> {
//   // In a real app, you might want to use a library like jsonwebtoken
//   // For now, we'll use Supabase's built-in JWT
//   const supabase = createServerClientAlias()
//   const { data, error } = await supabase.auth.getSession()

//   if (error || !data.session) {
//     console.error("Error generating token:", error)
//     throw new Error("Failed to generate authentication token")
//   }

//   return data.session.access_token
// }

/**
 * Set the authentication cookie in the response
 */
// export function setAuthCookie(token: string) {
//   cookies().set({
//     name: "auth_token",
//     value: token,
//     httpOnly: true,
//     path: "/",
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//     sameSite: "lax",
//   })
// }

// Set auth cookie
// export function setAuthCookieAlias(name: string, value: string, options: any = {}): void {
//   const cookieStore = cookies()

//   cookieStore.set(name, value, {
//     path: "/",
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     maxAge: 60 * 60 * 24 * 7, // 1 week
//     ...options,
//   })
// }

/**
 * Get the authentication token from the request
 */
// export function getAuthToken(request: NextRequestAlias): string | null {
//   const authHeader = request.headers.get("authorization")
//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     return authHeader.substring(7)
//   }

//   const token = request.cookies.get("auth_token")?.value
//   return token || null
// }

/**
 * Verify the JWT token and return the payload
 */
// export function verifyToken(token: string) {
//   try {
//     return jwt.verify(token, JWT_SECRET)
//   } catch (error) {
//     return null
//   }
// }

/**
 * Get the current user from the request
 */
// export async function getCurrentUser() {
//   const token = getAuthCookie()

//   if (!token) return null

//   const payload = verifyToken(token)
//   if (!payload) return null

//   try {
//     const { data, error } = await supabaseAdminClient.auth.admin.getUserById(payload.sub as string)

//     if (error || !data.user) return null

//     return mapUserToProfile(data.user)
//   } catch (error) {
//     console.error("Error getting current user:", error)
//     return null
//   }
// }

// Get current user
// export async function getCurrentUserAlias(): Promise<UserProfile | null> {
//   const supabase = createServerClientAlias()
//   const { data, error } = await supabase.auth.getUser()

//   if (error || !data.user) {
//     return null
//   }

//   return mapUserToProfile(data.user)
// }

// Check if user is authenticated
// export async function checkAuth(): Promise<UserProfile> {
//   const user = await getCurrentUserAlias()

//   if (!user) {
//     redirect("/login")
//   }

//   return user
// }

// Check if user has required role
// export async function checkRole(requiredRoles: string[]): Promise<UserProfile> {
//   const user = await checkAuth()

//   if (!requiredRoles.includes(user.role)) {
//     redirect("/unauthorized")
//   }

//   return user
// }

/**
 * Clear the authentication cookie
 */
// export function clearAuthCookie(response: NextResponse): void {
//   response.cookies.set({
//     name: "auth_token",
//     value: "",
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     path: "/",
//     maxAge: 0,
//   })
// }

/**
 * Check if the user has the required role
 */
// export function hasRole(user: UserData | null, requiredRole: string | string[]): boolean {
//   if (!user) return false

//   if (Array.isArray(requiredRole)) {
//     return requiredRole.includes(user.role)
//   }

//   return user.role === requiredRole
// }

// Log user activity
export async function logActivity(
  userId: string,
  action: ActivityAction,
  details?: any,
  req?: NextRequest,
): Promise<void> {
  try {
    const ipAddress = req?.headers.get("x-forwarded-for") || req?.ip || ""
    const userAgent = req?.headers.get("user-agent") || ""

    await supabaseClient.from("activity_logs").insert({
      user_id: userId,
      action,
      details,
      ip_address: ipAddress,
      user_agent: userAgent,
    })
  } catch (error) {
    console.error("Error logging activity:", error)
  }
}

// Password authentication
export async function authenticateWithPassword(
  email: string,
  password: string,
  req?: NextRequest,
): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    // Sign in with Supabase
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      // Log failed login attempt
      const { data: userByEmail } = await supabaseClient.from("user_profiles").select("id").eq("email", email).single()

      if (userByEmail) {
        await logActivity(
          userByEmail.id,
          "failed_login",
          { method: "password", reason: error?.message || "Invalid credentials" },
          req,
        )
      }

      return {
        user: null,
        error: error?.message || "Invalid email or password",
      }
    }

    // Get user profile
    const { data: profile } = await supabaseClient.from("user_profiles").select("*").eq("id", data.user.id).single()

    // Check if user is active
    if (profile && !profile.is_active) {
      await logActivity(data.user.id, "failed_login", { method: "password", reason: "Account inactive" }, req)

      return {
        user: null,
        error: "Your account has been deactivated. Please contact an administrator.",
      }
    }

    // Update last active timestamp
    await supabaseClient
      .from("user_profiles")
      .update({
        last_active: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.user.id)

    // Log successful login
    await logActivity(data.user.id, "login", { method: "password" }, req)

    // Map user data to profile
    const userProfile = mapUserToProfile(data.user, profile)

    return { user: userProfile }
  } catch (error) {
    console.error("Password authentication failed:", error)
    return {
      user: null,
      error: "An unexpected error occurred during authentication",
    }
  }
}

// PIN authentication
export async function authenticateWithPin(email: string, pin: string) {
  try {
    // First, verify the user exists
    const { data: userData, error: userError } = await supabaseAdminClient
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (userError || !userData) {
      throw new Error("User not found")
    }

    // Verify PIN (in a real app, this should be hashed)
    if (userData.pin !== pin) {
      throw new Error("Invalid PIN")
    }

    // Get the user from Supabase Auth
    const { data: authData, error: authError } = await supabaseAdminClient.auth.admin.getUserByEmail(email)

    if (authError || !authData.user) {
      throw new Error("Authentication failed")
    }

    const user = mapUserToProfile(authData.user)
    return { success: true, user }
  } catch (error: any) {
    console.error("PIN authentication error:", error.message)
    return { success: false, error: error.message }
  }
}

// Set up PIN for a user
export async function setupPin(
  userId: string,
  pin: string,
  req?: NextRequest,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate PIN format (6 digits)
    if (!/^\d{6}$/.test(pin)) {
      return {
        success: false,
        error: "PIN must be 6 digits",
      }
    }

    // Hash the PIN
    const pinHash = await bcrypt.hash(pin, 10)

    // Check if user already has a PIN
    const { data: existingPin } = await supabaseClient.from("user_pins").select("*").eq("user_id", userId).single()

    // Update or insert PIN
    if (existingPin) {
      const { error: updateError } = await supabaseClient
        .from("user_pins")
        .update({
          pin_hash: pinHash,
          attempts: 0,
          locked_until: null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)

      if (updateError) {
        console.error("Error updating PIN:", updateError)
        return {
          success: false,
          error: "Failed to update PIN",
        }
      }
    } else {
      const { error: insertError } = await supabaseClient.from("user_pins").insert({
        user_id: userId,
        pin_hash: pinHash,
        attempts: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("Error inserting PIN:", insertError)
        return {
          success: false,
          error: "Failed to set up PIN",
        }
      }
    }

    // Update user profile
    const { error: profileError } = await supabaseClient
      .from("user_profiles")
      .update({
        has_pin: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (profileError) {
      console.error("Error updating user profile:", profileError)
      return {
        success: false,
        error: "Failed to update user profile",
      }
    }

    // Log activity
    await logActivity(userId, existingPin ? "pin_update" : "pin_setup", {}, req)

    return { success: true }
  } catch (error) {
    console.error("Error setting up PIN:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Logout
export async function logout(userId?: string, req?: NextRequest): Promise<{ success: boolean; error?: string }> {
  try {
    // Log activity if userId is provided
    if (userId) {
      await logActivity(userId, "logout", {}, req)
    }

    const { error } = await supabaseClient.auth.signOut()

    if (error) {
      console.error("Error logging out:", error)
      return {
        success: false,
        error: "Failed to log out",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error logging out:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Create user
// export async function createUser(userData: {
//   email: string
//   password: string
//   username?: string
//   full_name?: string
//   role?: UserRole
//   department?: string
//   position?: string
//   pin?: string
//   phone_number?: string
// }): Promise<{ user: UserProfile | null; error?: string }> {
//   try {
//     const {
//       email,
//       password,
//       username = email.split("@")[0],
//       full_name = "",
//       role = "user",
//       department = "",
//       position = "",
//       pin = "",
//       phone_number = "",
//     } = userData

//     // Create user in Supabase
//     const { data, error } = await supabaseClient.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           full_name,
//           role,
//         },
//       },
//     })

//     if (error || !data.user) {
//       console.error("Error creating user:", error)
//       return {
//         user: null,
//         error: error?.message || "Failed to create user",
//       }
//     }

//     // Create user profile
//     const { error: profileError } = await supabaseClient.from("user_profiles").insert({
//       id: data.user.id,
//       username,
//       email,
//       full_name,
//       role,
//       department,
//       position,
//       has_pin: !!pin,
//       is_active: true,
//       phone_number,
//       two_factor_enabled: false,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//     })

//     if (profileError) {
//       console.error("Error creating user profile:", profileError)
//       return {
//         user: null,
//         error: "Failed to create user profile",
//       }
//     }

//     // Set up PIN if provided
//     if (pin) {
//       await setupPin(data.user.id, pin)
//     }

//     // Get created profile
//     const { data: profile } = await supabaseClient.from("user_profiles").select("*").eq("id", data.user.id).single()

//     // Map user data to profile
//     const userProfile = mapUserToProfile(data.user, profile)

//     return { user: userProfile }
//   } catch (error) {
//     console.error("Error creating user:", error)
//     return {
//       user: null,
//       error: "An unexpected error occurred",
//     }
//   }
// }

// Update user
export async function updateUser(
  userId: string,
  userData: {
    username?: string
    email?: string
    password?: string
    full_name?: string
    role?: UserRole
    department?: string
    position?: string
    avatar_url?: string
    is_active?: boolean
    phone_number?: string
    two_factor_enabled?: boolean
  },
  req?: NextRequest,
): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const {
      email,
      password,
      username,
      full_name,
      role,
      department,
      position,
      avatar_url,
      is_active,
      phone_number,
      two_factor_enabled,
    } = userData

    // Update auth user if email or password is provided
    if (email || password) {
      const { error } = await supabaseClient.auth.updateUser({
        email,
        password,
      })

      if (error) {
        console.error("Error updating auth user:", error)
        return {
          user: null,
          error: error.message,
        }
      }
    }

    // Prepare profile update data
    const updateData: any = { updated_at: new Date().toISOString() }

    if (username !== undefined) updateData.username = username
    if (full_name !== undefined) updateData.full_name = full_name
    if (role !== undefined) updateData.role = role
    if (department !== undefined) updateData.department = department
    if (position !== undefined) updateData.position = position
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url
    if (is_active !== undefined) updateData.is_active = is_active
    if (phone_number !== undefined) updateData.phone_number = phone_number
    if (two_factor_enabled !== undefined) updateData.two_factor_enabled = two_factor_enabled

    // Update user profile if there are profile fields to update
    if (Object.keys(updateData).length > 1) {
      // > 1 because we always have updated_at
      const { error: profileError } = await supabaseClient.from("user_profiles").update(updateData).eq("id", userId)

      if (profileError) {
        console.error("Error updating user profile:", profileError)
        return {
          user: null,
          error: "Failed to update user profile",
        }
      }
    }

    // Log activity
    await logActivity(userId, "profile_update", { fields: Object.keys(userData) }, req)

    // Get updated user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return {
        user: null,
        error: "Failed to get updated user",
      }
    }

    // Get updated profile
    const { data: profile } = await supabaseClient.from("user_profiles").select("*").eq("id", userId).single()

    // Map user data to profile
    const userProfile = mapUserToProfile(user, profile)

    return { user: userProfile }
  } catch (error) {
    console.error("Error updating user:", error)
    return {
      user: null,
      error: "An unexpected error occurred",
    }
  }
}

// Get user activity logs
export async function getUserActivityLogs(
  userId: string,
  limit = 50,
  offset = 0,
): Promise<{ logs: any[]; count: number; error?: string }> {
  try {
    // Get logs
    const { data, error, count } = await supabaseClient
      .from("activity_logs")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error getting activity logs:", error)
      return {
        logs: [],
        count: 0,
        error: "Failed to get activity logs",
      }
    }

    return {
      logs: data || [],
      count: count || 0,
    }
  } catch (error) {
    console.error("Error getting activity logs:", error)
    return {
      logs: [],
      count: 0,
      error: "An unexpected error occurred",
    }
  }
}

// Request password reset
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      console.error("Error requesting password reset:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error requesting password reset:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Reset password
export async function resetPassword(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseClient.auth.updateUser({
      password,
    })

    if (error) {
      console.error("Error resetting password:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Get user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (user) {
      // Log activity
      await logActivity(user.id, "password_reset", {})
    }

    return { success: true }
  } catch (error) {
    console.error("Error resetting password:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Google authentication (stub for backward compatibility)
export async function handleGoogleCallback(googleUser: any): Promise<UserProfile | null> {
  console.warn("Google authentication is not supported in this version")
  return null
}

// Set up security questions
export async function setupSecurityQuestions(
  userId: string,
  questions: Array<{ question: string; answer: string }>,
  req?: NextRequest,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete existing questions
    await supabaseClient.from("security_questions").delete().eq("user_id", userId)

    // Hash answers and insert new questions
    const questionsToInsert = await Promise.all(
      questions.map(async ({ question, answer }) => ({
        user_id: userId,
        question,
        answer_hash: await bcrypt.hash(answer.toLowerCase().trim(), 10),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    )

    const { error } = await supabaseClient.from("security_questions").insert(questionsToInsert)

    if (error) {
      console.error("Error setting up security questions:", error)
      return {
        success: false,
        error: "Failed to set up security questions",
      }
    }

    // Log activity
    await logActivity(userId, "profile_update", { fields: ["security_questions"] }, req)

    return { success: true }
  } catch (error) {
    console.error("Error setting up security questions:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Verify security question answers
export async function verifySecurityQuestions(
  userId: string,
  answers: Array<{ id: number; answer: string }>,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get questions
    const { data: questions, error } = await supabaseClient.from("security_questions").select("*").eq("user_id", userId)

    if (error || !questions || questions.length === 0) {
      console.error("Error getting security questions:", error)
      return {
        success: false,
        error: "Security questions not found",
      }
    }

    // Verify each answer
    const results = await Promise.all(
      answers.map(async ({ id, answer }) => {
        const question = questions.find((q) => q.id === id)
        if (!question) return false

        return bcrypt.compare(answer.toLowerCase().trim(), question.answer_hash)
      }),
    )

    // All answers must be correct
    const allCorrect = results.every((result) => result)

    return {
      success: allCorrect,
      error: allCorrect ? undefined : "One or more answers are incorrect",
    }
  } catch (error) {
    console.error("Error verifying security questions:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Authentication functions
// export async function signIn(email: string, password: string) {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   })

//   if (error) {
//     throw new Error(error.message)
//   }

//   return data
// }

// export async function signUp(email: string, password: string) {
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//   })

//   if (error) {
//     throw new Error(error.message)
//   }

//   return data
// }

export async function signOutFn() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export async function resetPasswordFn(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export async function updatePasswordFn(password: string) {
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    return null
  }

  return data.user
}

// export function getAuthCookie() {
//   return cookies().get("auth_token")?.value
// }

export function removeAuthCookie() {
  cookies().delete("auth_token")
}

// export async function registerUser(email: string, password: string, userData: any) {
//   try {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           full_name: userData.name,
//           role: "user",
//           ...userData,
//         },
//       },
//     })

//     if (error) throw error

//     const user = mapUserToProfile(data.user)
//     return { success: true, user }
//   } catch (error: any) {
//     console.error("Registration error:", error.message)
//     return { success: false, error: error.message }
//   }
// }

// Login user
// export async function loginUser(
//   email: string,
//   password: string,
// ): Promise<{ success: boolean; message: string; user?: UserProfile }> {
//   const supabase = createServerClientAlias()

//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   })

//   if (error) {
//     return {
//       success: false,
//       message: error.message,
//     }
//   }

//   if (!data.user) {
//     return {
//       success: false,
//       message: "Authentication failed",
//     }
//   }

//   return {
//     success: true,
//     message: "Login successful",
//     user: mapUserToProfile(data.user),
//   }
// }

// Logout user
export async function logoutUser(): Promise<void> {
  const supabase = createServerClientAlias()
  await supabase.auth.signOut()
}

// Register user
// export async function registerUserAlias(
//   email: string,
//   password: string,
//   userData: any,
// ): Promise<{ success: boolean; message: string; user?: UserProfile }> {
//   const supabase = createServerClientAlias()

//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: userData,
//     },
//   })

//   if (error) {
//     return {
//       success: false,
//       message: error.message,
//     }
//   }

//   if (!data.user) {
//     return {
//       success: false,
//       message: "Registration failed",
//     }
//   }

//   return {
//     success: true,
//     message: "Registration successful",
//     user: mapUserToProfile(data.user),
//   }
// }

// Update user profile
export async function updateUserProfile(
  userId: string,
  profileData: Partial<UserProfile>,
): Promise<{ success: boolean; message: string; user?: UserProfile }> {
  const supabase = createServerClientAlias()

  // Update auth metadata
  const { data: authData, error: authError } = await supabase.auth.updateUser({
    data: {
      full_name: profileData.fullName,
      avatar_url: profileData.avatar,
      ...profileData,
    },
  })

  if (authError) {
    return {
      success: false,
      message: authError.message,
    }
  }

  // Update profile in database
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: profileData.fullName,
      avatar_url: profileData.avatar,
      updated_at: new Date().toISOString(),
      ...profileData,
    })
    .eq("id", userId)

  if (profileError) {
    return {
      success: false,
      message: profileError.message,
    }
  }

  return {
    success: true,
    message: "Profile updated successfully",
    user: authData.user ? mapUserToProfile(authData.user) : undefined,
  }
}

// export async function authenticateUser(email: string, password: string) {
//   try {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })

//     if (error) throw error

//     const user = mapUserToProfile(data.user)
//     return { success: true, user }
//   } catch (error: any) {
//     console.error("Authentication error:", error.message)
//     return { success: false, error: error.message }
//   }
// }

// Secret key for JWT
// const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Login user with email and password
export async function loginUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    if (!data.user) {
      return {
        success: false,
        message: "User not found",
      }
    }

    // Get user profile data
    const adminClient = createAdminClient()
    const { data: profileData } = await adminClient.from("profiles").select("*").eq("id", data.user.id).single()

    // Map user data to profile
    const userProfile = mapUserToProfile(data.user, profileData)

    return {
      success: true,
      message: "Login successful",
      user: userProfile,
    }
  } catch (error: any) {
    console.error("Login error:", error)
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    }
  }
}

// Register new user
export async function registerUser(email: string, password: string, fullName: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    if (!data.user) {
      return {
        success: false,
        message: "Failed to create user",
      }
    }

    // Create profile record
    const adminClient = createAdminClient()
    await adminClient.from("profiles").insert({
      id: data.user.id,
      full_name: fullName,
      role: "user",
      is_active: true,
    })

    return {
      success: true,
      message: "Registration successful",
    }
  } catch (error: any) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    }
  }
}

// Generate JWT token
export async function generateToken(user: UserProfile): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(JWT_SECRET))

  return token
}

// Verify JWT token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return { success: true, payload }
  } catch (error) {
    return { success: false, error }
  }
}

// Set auth cookie
export function setAuthCookie(name: string, value: string) {
  cookies().set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  })
}

// Get auth cookie
export function getAuthCookie(name: string) {
  return cookies().get(name)?.value
}

// Delete auth cookie
export function deleteAuthCookie(name: string) {
  cookies().delete(name)
}

// Get current user from token
export async function getCurrentUser() {
  const token = getAuthCookie("auth_token")

  if (!token) {
    return null
  }

  const { success, payload } = await verifyToken(token)

  if (!success || !payload.id) {
    return null
  }

  // Get user profile
  const { data: user } = await supabase.auth.getUser()

  if (!user || !user.user) {
    return null
  }

  // Get profile data
  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.user.id).single()

  return mapUserToProfile(user.user, profileData)
}

