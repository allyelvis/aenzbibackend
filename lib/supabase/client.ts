import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { User } from "@supabase/supabase-js"

// Environment variables validation
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL")
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// Create Supabase client
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
})

// Create Supabase admin client (for server-side operations)
export const createAdminClient = () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY")
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
    },
  })
}

// Create Supabase client with cookies (for server components)
export const createServerClient = () => {
  const cookieStore = cookies()

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        cookieStore.set(name, value, options)
      },
      remove(name, options) {
        cookieStore.set(name, "", { ...options, maxAge: 0 })
      },
    },
  })
}

// User profile interface
export interface UserProfile {
  id: string
  email: string
  fullName: string
  role: string
  avatar?: string
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  preferences?: Record<string, any>
}

// Map Supabase User to UserProfile
export function mapUserToProfile(user: User, profileData?: any): UserProfile {
  return {
    id: user.id,
    email: user.email || "",
    fullName: profileData?.full_name || user.user_metadata?.full_name || "",
    role: profileData?.role || user.user_metadata?.role || "user",
    avatar: profileData?.avatar_url || user.user_metadata?.avatar_url,
    lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at) : undefined,
    createdAt: new Date(user.created_at),
    updatedAt: profileData?.updated_at ? new Date(profileData.updated_at) : new Date(user.updated_at),
    isActive: profileData?.is_active !== undefined ? profileData.is_active : true,
    preferences: profileData?.preferences || user.user_metadata?.preferences || {},
  }
}

// Get user profile from database
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const adminClient = createAdminClient()

  // Get user from auth
  const { data: user, error: userError } = await adminClient.auth.admin.getUserById(userId)

  if (userError || !user) {
    console.error("Error fetching user:", userError)
    return null
  }

  // Get profile from profiles table
  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (profileError && profileError.code !== "PGRST116") {
    console.error("Error fetching profile:", profileError)
  }

  return mapUserToProfile(user.user, profile)
}

